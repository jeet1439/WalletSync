import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth'; 
import firestore, { Timestamp } from "@react-native-firebase/firestore";
import { Alert } from 'react-native'; 


const getWeekOfMonth = (date) => {
    const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const day = date.getDate();
    return Math.ceil(day / 7);
};

const showSimpleAlert = (msg) => {
    Alert.alert("Analytics Error", msg);
};


const Analetics = () => {
    const [activeTab, setActiveTab] = useState("Monthly");
    const [analyticsData, setAnalyticsData] = useState({
        Weekly: { labels: [], values: [] },
        Monthly: { labels: [], values: [] },
        Yearly: { labels: [], values: [] },
    });

    const aiInsights = {
        Weekly: "Spending data is loading...",
        Monthly: "Spending data is loading...",
        Yearly: "Spending data is loading...",
    };


    const fetchAnalyticsData = () => {
        const user = auth().currentUser;
        if (!user) {
            showSimpleAlert("User not authenticated. Please log in.");
            return;
        }

        const uid = user.uid;
        const currentYear = new Date().getFullYear().toString();

        try {
            // Fetch all records for the current year
            firestore()
                .collection("records")
                .doc(uid)
                .collection(currentYear)
                .onSnapshot(snapshot => {
                    const records = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data(),
                        amount: Number(doc.data().amount),
                        date: doc.data().timestamp.toDate(), 
                    }))
                    .filter(item => item.type === "debit");

                    const processedData = processRecordsForAnalytics(records);
                    setAnalyticsData(processedData);

                }, (error) => {
                    console.log("Firestore fetch error:", error);
                    showSimpleAlert("Failed to fetch analytics data.");
                });

        } catch (error) {
            console.log(error);
            showSimpleAlert("Something went wrong during data retrieval.");
        }
    };

    const processRecordsForAnalytics = (records) => {
        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        const yearlyDataMap = {};
        records.forEach(item => {
            const year = item.date.getFullYear().toString();
            yearlyDataMap[year] = (yearlyDataMap[year] || 0) + item.amount;
        });

        const sortedYears = Object.keys(yearlyDataMap).sort();
        const yearly = {
            labels: sortedYears,
            values: sortedYears.map(year => yearlyDataMap[year]),
        };

        const monthlyDataMap = {};
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        records.filter(item => item.date.getFullYear() === currentYear)
               .forEach(item => {
                   const monthIndex = item.date.getMonth();
                   const month = monthNames[monthIndex];
                   monthlyDataMap[month] = (monthlyDataMap[month] || 0) + item.amount;
               });
        
        const monthly = {
            labels: monthNames,
            values: monthNames.map(month => monthlyDataMap[month] || 0),
        };

        const weeklyDataMap = {};
        records.filter(item => 
            item.date.getFullYear() === currentYear && item.date.getMonth() === currentMonth
        ).forEach(item => {
            const week = getWeekOfMonth(item.date); // 1, 2, 3, or 4
            weeklyDataMap[week] = (weeklyDataMap[week] || 0) + item.amount;
        });

        const weeklyLabels = ["W1", "W2", "W3", "W4"];
        const weekly = {
            labels: weeklyLabels,
            values: weeklyLabels.map((_, index) => weeklyDataMap[index + 1] || 0),
        };

        return { Weekly: weekly, Monthly: monthly, Yearly: yearly };
    };


    useEffect(() => {
        fetchAnalyticsData();
    }, []); 

    const chart = analyticsData[activeTab]; 
    const maxValue = chart.values.length > 0 ? Math.max(...chart.values) : 1;
    const total = chart.values.reduce((a, b) => a + b, 0);


    const getAiInsight = (tab) => {
        
        const now = new Date(); 

        const data = analyticsData[tab];
        if (!data || data.values.length === 0 || total === 0) return "No sufficient data to generate insights yet.";

        if (tab === "Monthly") {
            const currentMonthTotal = data.values[now.getMonth()]; 
            const average = data.values.reduce((sum, val) => sum + val, 0) / data.values.length;
            
            if (currentMonthTotal > average * 1.2) {
                return `Your current month's spending (${currentMonthTotal}) is significantly above your yearly monthly average. Consider a review!`;
            }
            return `Your monthly expenditure is tracking well. Keep monitoring your progress.`;
        }

        if (tab === "Weekly") {
            const weekIndex = data.values.indexOf(maxValue);
            const peakLabel = data.labels[weekIndex];
            return `Peak spending was observed in ${peakLabel} with an amount of ₹${maxValue}.`;
        }

        if (tab === "Yearly") {
            const latestYearTotal = data.values[data.values.length - 1];
            const previousYearTotal = data.values[data.values.length - 2] || latestYearTotal;
            const change = previousYearTotal === 0 ? 0 : ((latestYearTotal - previousYearTotal) / previousYearTotal) * 100;

            if (change > 5) {
                return `Expenditure increased by ${change.toFixed(1)}% compared to the previous year. You might be spending more!`;
            } else if (change < -5) {
                 return `Expenditure decreased by ${Math.abs(change).toFixed(1)}% compared to the previous year. Great savings!`;
            }
            return `Your yearly expenditure is stable, showing only a ${change.toFixed(1)}% change from last year.`;
        }
        return "Insight generation failed.";
    };


    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
              <Text style={styles.header}>Analytics</Text>
              <Image source={require('../../assets/images/graph.png')} style={styles.customIcon} />
            </View>

            <View style={styles.tabRow}>
                {["Weekly", "Monthly", "Yearly"].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        onPress={() => setActiveTab(tab)}
                        style={[styles.tab, activeTab === tab && styles.activeTab]}
                    >
                        <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View style={{ marginBottom: 10 }}>
                <Text style={styles.chartTitle}>Total Expenditure - {activeTab}</Text>
            </View>
            
            <View style={styles.chartContainer}>
                {chart.labels.map((label, index) => {
                    const value = chart.values[index];
                    return (
                        <View key={index} style={styles.barColumn}>
                            <View
                                style={[
                                    styles.bar,
                                    { height: (value / maxValue) * 150 }, // Scale bar height
                                ]}
                            />
                            <Text style={styles.barLabel}>{label}</Text>
                        </View>
                    )
                })}
            </View>
            
            <View style={styles.card}>
                <Text style={styles.cardTitle}>Total Spending ({activeTab})</Text>
                <Text style={styles.cardValue}>₹ {total.toFixed(2)}</Text>
            </View>

            <View style={styles.aiContainer}>
                <View style={styles.aiHeaderRow}>
                    <Text style={styles.aiIcon}>✨</Text>
                    <Text style={styles.aiTitle}>AI Review</Text>
                </View>
                <Text style={styles.aiBody}>
                    {getAiInsight(activeTab)}
                </Text>
            </View>
            <View style={{height: 40}} /> 

        </ScrollView>
    );
};



export default Analetics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b051dff',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerContainer: {
  flexDirection: 'row',
  gap: 5,
  // justifyContent: 'center', 
  alignItems: 'center', 
  },
  customIcon: {
      height: 45,
      width: 45
  },
  header: {
      color: "#fff",
      fontSize: 28,
      fontWeight: "700",
  },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#1c1533",
    borderRadius: 15,
    padding: 5,
    marginTop: 25,
  },

  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    borderRadius: 12,
  },

  activeTab: {
    backgroundColor: "#6a4cff",
  },

  tabText: {
    color: "#b6b3cc",
    fontSize: 16,
  },

  activeTabText: {
    color: "#fff",
    fontWeight: "600",
  },

  chartTitle: {
    color: "#dcd9ff",
    fontSize: 18,
    marginTop: 25,
    marginBottom: 10,
  },

  chartContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 180,
    marginTop: 10,
  },

  barColumn: {
    alignItems: "center",
  },

  bar: {
    width: 26,
    backgroundColor: "#6a4cff",
    borderRadius: 8,
  },

  barLabel: {
    marginTop: 6,
    color: "#ccc",
    fontSize: 13,
  },

  card: {
    backgroundColor: "rgba(28, 14, 53, 0.85)",
    padding: 20,
    borderRadius: 18,
    marginTop: 25,
  },

  cardTitle: {
    color: "#8181a8",
    fontSize: 15,
  },

  cardValue: {
    color: "#fff",
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 8,
  },

  aiContainer: {
    marginTop: 20,
    padding: 18,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#6a4cff", 
    backgroundColor: "rgba(106, 76, 255, 0.1)", 
  },
  
  aiHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  aiIcon: {
    fontSize: 18,
    marginRight: 8,
  },

  aiTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },

  aiBody: {
    color: "#dcd9ff",
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.9,
  },
});