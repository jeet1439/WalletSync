import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ImageBackground,
  Dimensions,
  FlatList,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get("window");

const CARD_DATA = [
  {
    id: '1',
    month: 'November',
    debit: '₹5000',
    credit: '₹8500',
    image: require('../../assets/images/customCard.png'),
  },
  {
    id: '2',
    month: 'October',
    debit: '₹7200',
    credit: '₹6100',
    image: require('../../assets/images/customCard.png'),
  },
  {
    id: '3',
    month: 'September',
    debit: '₹4300',
    credit: '₹9200',
    image: require('../../assets/images/customCard.png'),
  },
];

const TRANSACTION_DATA = [
  {
    id: "1",
    name: "Zomato",
    type: "Purchase",
    amount: "-₹420.00",
    time: "Today, 10:10 AM",
    icon: require("../../assets/images/zomatto.png"),
  },
  {
    id: "2",
    name: "Electricity Bill",
    type: "Bill Payment",
    amount: "-₹1,250.00",
    time: "Today, 9:00 AM",
    icon: require("../../assets/images/bill.png"),
  },
  {
    id: "3",
    name: "chinease dhaba",
    type: "Purchase",
    amount: "-₹99.00",
    time: "20-11-2025, 6:00 PM",
    icon: require("../../assets/images/food.png"),
  },
  {
    id: "4",
    name: "Metro Tickit",
    type: "Travel expence",
    amount: "-₹19.75",
    time: "18-11-2025, 9:00 AM",
    icon: require("../../assets/images/metro.png"),
  },
  {
    id: "5",
    name: "Hotel booking",
    type: "Room book",
    amount: "-₹2100.00",
    time: "16-11-2025, 7:00 PM",
    icon: require("../../assets/images/hotel.png"),
  },
];

const TransactionItem = ({ item }) => (
  <View style={styles.transactionItem}>
    <Image source={item.icon} style={styles.transactionIcon} />

    <View style={{ flex: 1 }}>
      <Text style={styles.transactionName}>{item.name}</Text>
      <Text style={styles.transactionType}>{item.type}</Text>
    </View>

    <View style={{ alignItems: "flex-end" }}>
      <Text style={styles.transactionAmount}>{item.amount}</Text>
      <Text style={styles.transactionTime}>{item.time}</Text>
    </View>
  </View>
);



const CardItem = ({ item }) => (
  <ImageBackground
    source={item.image}
    style={styles.cardContainer}
    imageStyle={styles.cardImage}
  >
    <Text style={styles.monthText}>
      {item.month}
    </Text>

    <View style={styles.bottomRow}>
      <View>
        <Text style={styles.label}>Debit</Text>
        <Text style={styles.value}>{item.debit}</Text> 
      </View>

      <View style={{ alignItems: "flex-end" }}>
        <Text style={styles.label}>Credit</Text>
        <Text style={styles.value}>{item.credit}</Text> 
      </View>
    </View>
  </ImageBackground>
);

const Home = () => {
  const [name, setName] = useState("");
  const navigation = useNavigation();

  useEffect(() => {
    const uid = auth().currentUser.uid;

    const unsubscribe = firestore()
      .collection("users")
      .doc(uid)
      .onSnapshot(doc => {
        if (doc.exists) {
          setName(doc.data().username);
        }
      });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>

      <View style={styles.headerContainer}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuNhTZJTtkR6b-ADMhmzPvVwaLuLdz273wvQ&s' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <View>
            <Text style={styles.helloText}>Hello,</Text>
            <Text style={styles.nameText}>{name} !</Text>
          </View>
        </View>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="apps" size={22} color="#fff" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.iconButton}>
            <MaterialCommunityIcons name="email-outline" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.overviewSection}>
        <Text style={styles.overviewTitle}>Overview</Text>
        <TouchableOpacity>
          <Text style={styles.overviewButton}>Add new +</Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={CARD_DATA}
        renderItem={({ item }) => <CardItem item={item} />}
        keyExtractor={item => item.id}
        horizontal
        inverted={true}
        showsHorizontalScrollIndicator={false}
        style={styles.flatListContainer}
        pagingEnabled
        />

     <View style={styles.transactionContainer}>
     <View style={styles.transactionHeader}>
      <Text style={styles.historyTitle}>History</Text>
      <TouchableOpacity style={styles.lastWeekButton}>
        <Text style={styles.lastWeekText}>last week</Text>
        <Ionicons name="chevron-down" size={16} color="#aaa" style={{ marginLeft: 5 }} />
      </TouchableOpacity>
    </View>
      <FlatList
        data={TRANSACTION_DATA}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem item={item} />}
        showsVerticalScrollIndicator={false}
        style={{marginBottom: height * 0.10}}
      />

     </View>

    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b051dff',
    paddingHorizontal: 20, 
    paddingTop: 50,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    justifyContent: 'space-between',
  },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 30,
    marginRight: 10,
  },
  helloText: {
    fontSize: 16,
    color: '#f3f3f3ff',
  },
  nameText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  iconRow: {
    flexDirection: 'row',
    gap: 10,
  },
  iconButton: {
    backgroundColor: '#381a65',
    padding: 10,
    borderRadius: 30,
  },
  overviewSection: {
    width: width - 60,
    marginHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  overviewTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  overviewButton: {
    fontSize: 14,
    color: '#b6b6b6ff',
    fontWeight: '500',
  },
  flatListContainer: {
    height: 210, 
    marginBottom: 20,
  },

  cardContainer: {
    marginHorizontal: 5,
    width: width - 50, 
    height: 210,
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",

  },
  cardImage: {
    borderRadius: 14,
    resizeMode: "cover",
  },
  monthText: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "700",
  },
  bottomRow: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.8,
  },
  value: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  transactionContainer: {
    position: "absolute",
    bottom: 0,
    height: "50%", 
    width: width - 50,
    alignSelf: 'center',
    marginHorizontal:  30,  
    borderWidth: 1,   
    backgroundColor: "rgba(28, 14, 53, 0.85)",
    borderColor: "rgba(255, 255, 255, 0.2)", 
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 18,
    borderBottomWidth: 0,
},
transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  lastWeekButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#381A65', 
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  lastWeekText: {
    color: '#b6b6b6ff',
    fontSize: 14,
    fontWeight: '500',
  },
  transactionItem: {
  flexDirection: "row",
  alignItems: "center",
  marginBottom: 18,
},

transactionIcon: {
  width: 40,
  height: 40,
  borderRadius: 10,
  marginRight: 15,
},

transactionName: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "600",
},

transactionType: {
  color: "#b6b6b6",
  fontSize: 13,
  marginTop: 3,
},

transactionAmount: {
  color: "#ff6b6b",
  fontWeight: "700",
  fontSize: 16,
},

transactionTime: {
  color: "#b6b6b6",
  fontSize: 12,
  marginTop: 3,
},

});

export default Home;