import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get("window");
const wp = p => (width * p) / 100;

const notifications = [
  {
    id: '1',
    title: 'Transaction Added',
    message: '₹500 added to your wallet',
    time: '2 min ago',
    icon: 'wallet-plus',
    color: '#2ecc71',
  },
  {
    id: '2',
    title: 'Debit Alert',
    message: '₹250 spent on Food',
    time: '1 hour ago',
    icon: 'food',
    color: '#ff5e5e',
  },
  {
    id: '3',
    title: 'Monthly Summary',
    message: 'Your September report is ready',
    time: 'Yesterday',
    icon: 'chart-bar',
    color: '#6b4ce6',
  },
  {
    id: '4',
    title: 'New Feature',
    message: 'You can now track weekly expenses',
    time: '2 days ago',
    icon: 'sparkles',
    color: '#a020f0',
  },
  {
    id: '5',
    title: 'Security Alert',
    message: 'New login detected on your account',
    time: '3 days ago',
    icon: 'shield-check',
    color: '#f1c40f',
  },
];

const NotificationItem = ({ item }) => (
  <TouchableOpacity activeOpacity={0.7} style={styles.card}>
    <View style={[styles.iconBox, { backgroundColor: item.color + '22' }]}>
      <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
    </View>

    <View style={{ flex: 1 }}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.message}>{item.message}</Text>
    </View>

    <Text style={styles.time}>{item.time}</Text>
  </TouchableOpacity>
);

const Notification = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0b051d" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons
            name="arrow-left"
            size={26}
            color="#fff"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Notifications</Text>

        <View style={{ width: 26 }} />
      </View>

      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <NotificationItem item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 30 }}
      />
    </View>
  );
};

export default Notification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b051d',
    paddingHorizontal: wp(5),
    paddingTop: wp(4),
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: wp(4),
  },

  headerTitle: {
    fontSize: wp(5.5),
    fontWeight: '700',
    color: '#fff',
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c0e35',
    padding: wp(4),
    borderRadius: wp(4),
    marginBottom: wp(3),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  iconBox: {
    width: wp(11),
    height: wp(11),
    borderRadius: wp(3),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: wp(4),
  },

  title: {
    color: '#fff',
    fontSize: wp(4),
    fontWeight: '600',
  },

  message: {
    color: '#b6b6b6',
    fontSize: wp(3.4),
    marginTop: 2,
  },

  time: {
    color: '#888',
    fontSize: wp(3),
    marginLeft: wp(2),
  },
});
