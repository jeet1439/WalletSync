import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  StatusBar,
  TextInput,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get("window");
const wp = p => (width * p) / 100;
const hp = p => (height * p) / 100;

const getReasonIcon = (reason) => {
  switch (reason) {
    case "Food":
      return require("../../assets/images/food.png");
    case "Tickets":
      return require("../../assets/images/metro.png");
    case "Clothes":
      return require("../../assets/images/shopping.png");
    case "Amount Added":
      return require("../../assets/images/amount.png");
    default:
      return require("../../assets/images/bill.png");
  }
};

const TransactionItem = ({ item, onLongPress }) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onLongPress={onLongPress}
    style={styles.transactionItem}
  >
    <Image source={getReasonIcon(item.reason)} style={styles.icon} />

    <View style={{ flex: 1 }}>
      <Text style={styles.reason}>{item.reason}</Text>
      <Text style={styles.type}>{item.type}</Text>
    </View>

    <View style={{ alignItems: 'flex-end' }}>
      <Text
        style={[
          styles.amount,
          { color: item.type === 'credit' ? '#2ecc71' : '#ff5e5e' }
        ]}
      >
        ₹{item.amount}
      </Text>
      <Text style={styles.time}>
        {item.timestamp?.toDate().toLocaleString()}
      </Text>
    </View>
  </TouchableOpacity>
);

const TransactionList = () => {
  const navigation = useNavigation();

  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [search, setSearch] = useState("");
  
  const PAGE_SIZE = 10;

  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);



  const fetchTransactions = async (loadMore = false) => {
  if (loading || !hasMore) return;

  setLoading(true);

  const user = auth().currentUser;
  const year = new Date().getFullYear().toString();

  let query = firestore()
    .collection("records")
    .doc(user.uid)
    .collection(year)
    .orderBy("timestamp", "desc")
    .limit(PAGE_SIZE);

  if (loadMore && lastDoc) {
    query = query.startAfter(lastDoc);
  }

  const snapshot = await query.get();

  if (!snapshot.empty) {
    const newData = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    setLastDoc(snapshot.docs[snapshot.docs.length - 1]);

    setTransactions(prev =>
      loadMore ? [...prev, ...newData] : newData
    );

    setFilteredTransactions(prev =>
      loadMore ? [...prev, ...newData] : newData
    );

    if (snapshot.docs.length < PAGE_SIZE) {
      setHasMore(false);
    }
  } else {
    setHasMore(false);
  }

  setLoading(false);
};

useEffect(() => {
  fetchTransactions();
}, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredTransactions(transactions);
      return;
    }

    const text = search.toLowerCase();

    const filtered = transactions.filter(item =>
      item.reason?.toLowerCase().includes(text) ||
      item.type?.toLowerCase().includes(text) ||
      item.amount?.toString().includes(text)
    );

    setFilteredTransactions(filtered);
  }, [search, transactions]);

  const deleteTransaction = (id) => {
    Alert.alert(
      "Delete Transaction",
      "Do you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const user = auth().currentUser;
            const year = new Date().getFullYear().toString();

            await firestore()
              .collection("records")
              .doc(user.uid)
              .collection(year)
              .doc(id)
              .delete();
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0b051d" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialCommunityIcons name="arrow-left" size={26} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Transactions</Text>
        <View style={{ width: 26 }} />
      </View>

      <View style={styles.searchBox}>
        <MaterialCommunityIcons name="magnify" size={22} color="#aaa" />
        <TextInput
          placeholder="Search transactions..."
          placeholderTextColor="#888"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>


      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TransactionItem
            item={item}
            onLongPress={() => deleteTransaction(item.id)}
          />
        )}
        onEndReached={() => fetchTransactions(true)}
        onEndReachedThreshold={0.4}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: hp(4) }}
        ListFooterComponent={
          loading && (
            <Text style={{ color: '#aaa', textAlign: 'center', marginVertical: 15 }}>
              Loading more...
            </Text>
          )
        }
        ListEmptyComponent={
          !loading && (
            <View style={styles.emptyBox}>
              <MaterialCommunityIcons
                name="file-document-outline"
                size={60}
                color="#555"
              />
              <Text style={styles.emptyText}>No transactions found</Text>
            </View>
          )
        }
      />


    </View>
  );
};

export default TransactionList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b051d',
    paddingHorizontal: wp(5),
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: hp(2),
  },

  headerTitle: {
    fontSize: wp(5.5),
    fontWeight: '700',
    color: '#fff',
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c0e35',
    borderRadius: wp(4),
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.2),
    marginBottom: hp(2),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: wp(4),
    marginLeft: wp(2),
  },

  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1c0e35',
    padding: wp(4),
    borderRadius: wp(4),
    marginBottom: hp(1.8),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },

  icon: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(2),
    marginRight: wp(4),
  },

  reason: {
    color: '#fff',
    fontSize: wp(4.2),
    fontWeight: '600',
  },

  type: {
    color: '#b6b6b6',
    fontSize: wp(3.3),
    marginTop: hp(0.3),
  },

  amount: {
    fontSize: wp(4.2),
    fontWeight: '700',
  },

  time: {
    color: '#aaa',
    fontSize: wp(3),
    marginTop: hp(0.3),
  },

  emptyBox: {
    alignItems: 'center',
    marginTop: hp(20),
  },

  emptyText: {
    color: '#777',
    marginTop: hp(1),
    fontSize: wp(4),
  },
});
