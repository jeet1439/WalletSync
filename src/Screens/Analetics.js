import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import React, { useState } from 'react';

const Analetics = () => {
  const [activeTab, setActiveTab] = useState("Monthly");

  const dataSet = {
    Weekly: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      values: [200, 350, 150, 400, 250, 300, 180]
    },
    Monthly: {
      labels: ["W1", "W2", "W3", "W4"],
      values: [1200, 900, 1500, 1100]
    },
    Yearly: {
      labels: ["2022", "2023", "2024", "2025"],
      values: [15000, 18000, 22000, 17000]
    }
  };

  // Dynamic AI Text based on the active tab
  const aiInsights = {
    Weekly: "Spending peaked on Thursday. You are 12% below your weekly budget limit. Great job!",
    Monthly: "Week 3 saw higher utility costs than usual. Consider reviewing your recurring subscriptions.",
    Yearly: "2024 was your highest spending year. Current trends show a 15% reduction in 2025 expenses."
  };

  const chart = dataSet[activeTab];
  const maxValue = Math.max(...chart.values);
  const total = chart.values.reduce((a, b) => a + b, 0);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Analytics</Text>

      {/* Tabs */}
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

      {/* Chart */}
      <Text style={styles.chartTitle}>Total Expenditure – {activeTab}</Text>

      <View style={styles.chartContainer}>
        {chart.values.map((value, index) => (
          <View key={index} style={styles.barColumn}>
            <View
              style={[
                styles.bar,
                { height: (value / maxValue) * 150 }, // Scale bar
              ]}
            />
            <Text style={styles.barLabel}>{chart.labels[index]}</Text>
          </View>
        ))}
      </View>

      {/* Summary Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Spending</Text>
        <Text style={styles.cardValue}>₹ {total}</Text>
      </View>

      {/* --- NEW AI REVIEW BOX --- */}
      <View style={styles.aiContainer}>
        <View style={styles.aiHeaderRow}>
          <Text style={styles.aiIcon}>✨</Text>
          <Text style={styles.aiTitle}>AI Review</Text>
        </View>
        <Text style={styles.aiBody}>
          {aiInsights[activeTab]}
        </Text>
      </View>
      {/* ------------------------- */}
      
      {/* Bottom padding for scrolling */}
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

  // --- AI BOX STYLES ---
  aiContainer: {
    marginTop: 20,
    padding: 18,
    borderRadius: 18,
    // A subtle border to make it stand out as "special"
    borderWidth: 1,
    borderColor: "#6a4cff", 
    backgroundColor: "rgba(106, 76, 255, 0.1)", // Low opacity version of your accent color
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