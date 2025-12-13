import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


const { width, height } = Dimensions.get('window');
const wp = (p) => (width * p) / 100;
const hp = (p) => (height * p) / 100;


const getWeekOfMonth = (date) => {
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const day = date.getDate();
  return Math.ceil(day / 7);
};

const Analetics = () => {
  const [activeTab, setActiveTab] = useState('Monthly');

  const [analyticsData, setAnalyticsData] = useState({
    Weekly: { labels: [], values: [] },
    Monthly: { labels: [], values: [] },
    Yearly: { labels: [], values: [] },
  });

  const fetchAnalyticsData = () => {
    const user = auth().currentUser;
    if (!user) return;

    const uid = user.uid;
    const currentYear = new Date().getFullYear().toString();

    try {
      const unsubscribe = firestore()
        .collection('records')
        .doc(uid)
        .collection(currentYear)
        .onSnapshot(
          (snapshot) => {
            const records = snapshot.docs
              .map((doc) => ({
                id: doc.id,
                ...doc.data(),
                amount: Number(doc.data().amount),
                date: doc.data().timestamp.toDate(),
              }))
              .filter((item) => item.type === 'debit');

            const processed = processRecords(records);
            setAnalyticsData(processed);
          },
          (err) => console.log('Firestore fetch error:', err),
        );

      return unsubscribe;
    } catch (e) {
      console.log(e);
    }
  };

  const processRecords = (records) => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // YEARLY
    const yearlyData = {};
    records.forEach((item) => {
      const y = item.date.getFullYear().toString();
      yearlyData[y] = (yearlyData[y] || 0) + item.amount;
    });

    const years = Object.keys(yearlyData).sort();
    const yearly = {
      labels: years,
      values: years.map((y) => yearlyData[y]),
    };

    // MONTHLY
    const monthNames = [
      'Jan','Feb','Mar','Apr','May','Jun',
      'Jul','Aug','Sep','Oct','Nov','Dec'
    ];
    const monthlyData = {};

    records
      .filter((item) => item.date.getFullYear() === currentYear)
      .forEach((item) => {
        const m = monthNames[item.date.getMonth()];
        monthlyData[m] = (monthlyData[m] || 0) + item.amount;
      });

    const monthly = {
      labels: monthNames,
      values: monthNames.map((m) => monthlyData[m] || 0),
    };

    // WEEKLY
    const weeklyData = {};

    records
      .filter(
        (item) =>
          item.date.getFullYear() === currentYear &&
          item.date.getMonth() === currentMonth,
      )
      .forEach((item) => {
        const week = getWeekOfMonth(item.date);
        weeklyData[week] = (weeklyData[week] || 0) + item.amount;
      });

    const weeklyLabels = ['W1', 'W2', 'W3', 'W4'];
    const weekly = {
      labels: weeklyLabels,
      values: weeklyLabels.map((_, i) => weeklyData[i + 1] || 0),
    };

    return { Weekly: weekly, Monthly: monthly, Yearly: yearly };
  };

  useEffect(() => {
    const unsub = fetchAnalyticsData();
    return () => unsub && unsub();
  }, []);

  const chart = analyticsData[activeTab];
  const maxValue = chart.values.length > 0 ? Math.max(...chart.values) : 1;
  const total = chart.values.reduce((a, b) => a + b, 0);

  const getAiInsight = (tab) => {
    const now = new Date();
    const data = analyticsData[tab];

    if (!data || data.values.length === 0 || total === 0)
      return 'No sufficient data to generate insights yet.';

    if (tab === 'Monthly') {
      const currentMonthTotal = data.values[now.getMonth()];
      const avg =
        data.values.reduce((s, v) => s + v, 0) / data.values.length;

      if (currentMonthTotal > avg * 1.2) {
        return `Your current month's spending (₹${currentMonthTotal}) is above your average.`;
      }
      return 'Your monthly spending is stable.';
    }

    if (tab === 'Weekly') {
      const maxIndex = data.values.indexOf(maxValue);
      const peak = data.labels[maxIndex];
      return `Peak spending was in ${peak} at ₹${maxValue}.`;
    }

    if (tab === 'Yearly') {
      const last = data.values[data.values.length - 1];
      const prev = data.values[data.values.length - 2] || last;
      const change = prev === 0 ? 0 : ((last - prev) / prev) * 100;

      if (change > 5) return `Yearly spending increased by ${change.toFixed(1)}%.`;
      if (change < -5)
        return `Great! Spending decreased by ${Math.abs(change).toFixed(1)}%.`;

      return `Yearly spending is stable (${change.toFixed(1)}% change).`;
    }

    return 'Insight unavailable.';
  };

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Analytics</Text>
        <Image
          source={require('../../assets/images/graph.png')}
          style={styles.customIcon}
        />
      </View>

      <View style={styles.tabRow}>
        {['Weekly', 'Monthly', 'Yearly'].map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text
              style={[styles.tabText, activeTab === tab && styles.activeTabText]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.chartTitle}>Total Expenditure - {activeTab}</Text>

      <View style={styles.chartContainer}>
        {chart.labels.map((label, index) => {
          const value = chart.values[index];
          return (
            <View key={index} style={styles.barColumn}>
              <View
                style={[
                  styles.bar,
                  { height: (value / maxValue) * hp(20) },
                ]}
              />
              <Text style={styles.barLabel}>{label}</Text>
            </View>
          );
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

        <Text style={styles.aiBody}>{getAiInsight(activeTab)}</Text>
      </View>

      <View style={{ height: hp(5) }} />
    </ScrollView>
  );
};

export default Analetics;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b051d',
    paddingHorizontal: wp(5),
    paddingTop: hp(4),
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: wp(2),
  },

  header: {
    color: '#fff',
    fontSize: wp(7),
    fontWeight: '700',
  },

  customIcon: {
    width: wp(10),
    height: wp(10),
  },

  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#1c1533',
    borderRadius: wp(4),
    padding: wp(1),
    marginTop: hp(3),
  },

  tab: {
    flex: 1,
    paddingVertical: hp(1.8),
    alignItems: 'center',
    borderRadius: wp(3),
  },

  activeTab: {
    backgroundColor: '#6a4cff',
  },

  tabText: {
    fontSize: wp(4),
    color: '#b6b3cc',
  },

  activeTabText: {
    color: '#fff',
    fontWeight: '600',
  },

  chartTitle: {
    color: '#dcd9ff',
    fontSize: wp(5),
    marginTop: hp(3),
  },

  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: hp(25),
    marginTop: hp(1),
  },

  barColumn: {
    alignItems: 'center',
  },

  bar: {
    width: wp(5),
    backgroundColor: '#6a4cff',
    borderRadius: wp(2),
  },

  barLabel: {
    marginTop: hp(1),
    color: '#ccc',
    fontSize: wp(3.5),
  },

  card: {
    backgroundColor: 'rgba(28, 14, 53, 0.85)',
    padding: wp(5),
    borderRadius: wp(5),
    marginTop: hp(3),
  },

  cardTitle: {
    color: '#8181a8',
    fontSize: wp(4),
  },

  cardValue: {
    color: '#fff',
    fontSize: wp(7),
    fontWeight: '700',
    marginTop: hp(1),
  },

  aiContainer: {
    marginTop: hp(3),
    padding: wp(4),
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: '#6a4cff',
    backgroundColor: 'rgba(106, 76, 255, 0.1)',
  },

  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(1),
  },

  aiIcon: {
    fontSize: wp(5),
    marginRight: wp(2),
  },

  aiTitle: {
    color: '#fff',
    fontSize: wp(4.5),
    fontWeight: '600',
  },

  aiBody: {
    color: '#dcd9ff',
    fontSize: wp(3.8),
    lineHeight: hp(2.5),
  },
});
