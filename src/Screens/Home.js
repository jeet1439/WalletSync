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
  Modal,
  TextInput
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore, { Timestamp } from "@react-native-firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import CustomAlert from '../Components/CustomAlert';



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

const REASONS = ["Tickets", "Food", "Clothes", "Other"];

const getReasonIcon = (reason) => {
  switch (reason) {
    case "Food":
      return require("../../assets/images/food.png");

    case "Tickets":
      return require("../../assets/images/metro.png");

    case "Clothes":
      return require("../../assets/images/shopping.png");

    case "Amount Added":  // for credit
      return require("../../assets/images/amount.png");

    default:
      return require("../../assets/images/bill.png");
  }
};

const TransactionItem = ({ item }) => (
  <View style={styles.transactionItem}>
    <Image
      source={getReasonIcon(item.reason)}
      style={styles.transactionIcon}
    />
    <View style={{ flex: 1 }}>
      <Text style={styles.transactionName}>{item.reason}</Text>
      <Text style={styles.transactionType}>{item.type}</Text>
    </View>

    <View style={{ alignItems: "flex-end" }}>
      <Text
        style={[
          styles.transactionAmount,
          { color: item.type === 'credit' ? '#2ecc71' : '#ff5e5eff' },
        ]}
      >
        {item.amount}
      </Text>

      <Text style={styles.transactionTime}>
        {item.timestamp?.toDate().toLocaleString()}
      </Text>
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
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("credit");
  const [reason, setReason] = useState("");
  const [showReasonList, setShowReasonList] = useState(false);
  const [customReason, setCustomReason] = useState("");

  const [records, setRecords] = useState([]);
  
  const [cardData, setCardData] = useState([]);

  const navigation = useNavigation();
  const [alert, setAlert] = useState(null);

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
  };

  useEffect(() => {
    const user = auth().currentUser;
    if (!user) return;

    const uid = user.uid;

    const unsubscribe = firestore()
      .collection("users")
      .doc(uid)
      .onSnapshot(doc => {
        if (doc && doc.exists) {
          setName(doc.data().username);
        } else {
          console.log("User document does not exist");
        }
      });

    return unsubscribe;
  }, []);

  const saveRecords = async () => {
    if (!amount) {
      showAlert("info", "Please enter the amount!");
      return;
    }
    try {
      const user = auth().currentUser;
      const uid = user.uid;
      const CurrentYear = new Date().getFullYear();

      await firestore()
        .collection("records")
        .doc(uid)
        .collection(CurrentYear.toString())
        .add({
          amount: Number(amount),
          type: type,
          reason: type === "credit"
            ? "Amount Added"
            : (reason === "Other" ? customReason : reason),
          timestamp: firestore.Timestamp.now(),
        });

      showAlert("success", `Transaction saved!`);
      setAmount("");
      setCustomReason("");
      setReason("");
      setModalVisible(false);
    } catch (error) {
      console.log(error);
      showAlert("error", "Something went wrong!")
    }
  }

  const fetchRecords = () => {
  try {
    const user = auth().currentUser;
    if (!user) {
      showAlert("error", "Something went wrong!");
      return;
    }

    const uid = user.uid;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); 
    const startOfMonth = new Date(currentYear, currentMonth, 1);
    const startOfNextMonth = new Date(currentYear, currentMonth + 1, 1);

    firestore()
      .collection("records")
      .doc(uid)
      .collection(currentYear.toString())
      .where("timestamp", ">=", startOfMonth)
      .where("timestamp", "<", startOfNextMonth)
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshot => {
        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRecords(list);
        // console.log(list);
      });
  } catch (error) {
    console.log(error);
    showAlert("error", "Something went wrong!");
  }
};


  
  const fetchMonthlyRecords = () => {
  try {
    const user = auth().currentUser;
    if (!user) {
      showAlert("error", "Something went wrong!");
      return;
    }

    const uid = user.uid;
    const currentYear = new Date().getFullYear().toString();

    firestore()
      .collection("records")
      .doc(uid)
      .collection(currentYear)
      .onSnapshot(snapshot => {
        const records = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const monthlyData = {};
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        records.forEach(item => {
          const date = item.timestamp.toDate(); // Firestore timestamp
          const month = monthNames[date.getMonth()]; // Get month name

          if (!monthlyData[month]) {
            monthlyData[month] = { debit: 0, credit: 0 };
          }

          if (item.type === "credit") {
            monthlyData[month].credit += Number(item.amount);
          } else {
            monthlyData[month].debit += Number(item.amount);
          }
        });

        // Convert to array in CARD_DATA format and sort by month (latest first)
        const cardArray = Object.keys(monthlyData)
          .map((month, index) => ({
            id: (index + 1).toString(),
            month,
            debit: `₹${monthlyData[month].debit}`,
            credit: `₹${monthlyData[month].credit}`,
            image: require('../../assets/images/customCard.png'),
          }))
          .sort((a, b) => monthNames.indexOf(b.month) - monthNames.indexOf(a.month));

        setCardData(cardArray);
        console.log(cardArray);
      });

  } catch (error) {
    console.log(error);
    showAlert("error", "Something went wrong!");
  }
};



  useEffect(()=>{
    fetchMonthlyRecords();
    fetchRecords();
  }, [auth().currentUser])
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
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Text style={styles.overviewButton}>Add new +</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={cardData}
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
          <Text style={styles.historyTitle}>Transactions</Text>
          <TouchableOpacity style={styles.lastWeekButton}>
            <Text style={styles.lastWeekText}>This month</Text>
            <Ionicons name="chevron-down" size={16} color="#aaa" style={{ marginLeft: 5 }} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <TransactionItem item={item} />}
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: height * 0.10 }}
        />
      </View>
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
      >
        <View style={styles.modalWrapper}>
          <View style={styles.modalBox}>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 15
            }}>
              <Text style={styles.modalTitle}>Add Record</Text>
              <View style={styles.toggleWrapper}>
                <TouchableOpacity
                  onPress={() => setType("credit")}
                  style={[styles.sliderOption, type === "credit" && styles.activeSlide]}
                >
                  <Text style={[styles.sliderText, type === "credit" && styles.sliderTextActive]}>
                    Credit
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setType("debit")}
                  style={[styles.sliderOption, type === "debit" && styles.activeSlide]}
                >
                  <Text style={[styles.sliderText, type === "debit" && styles.sliderTextActive]}>
                    Debit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* Amount Input */}
            <TextInput
              placeholder="Enter amount"
              placeholderTextColor="#ccc"
              style={styles.input}
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
            />
            {/* Reason dropdown */}
            {/* Reason Buttons Row */}
            <View style={styles.reasonRow}>
              {REASONS.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.reasonButton,
                    reason === item && styles.reasonButtonSelected,
                  ]}
                  onPress={() => setReason(item)}
                >
                  <Text
                    style={[
                      styles.reasonText,
                      reason === item && styles.reasonTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {showReasonList && (
              <View style={styles.dropDownBox}>
                {REASONS.map((item, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setReason(item);
                      setShowReasonList(false);
                    }}
                    style={styles.dropDownItem}
                  >
                    <Text style={{ color: "#fff", fontSize: 16 }}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {reason === "Other" && (
              <TextInput
                placeholder="Enter custom reason"
                placeholderTextColor="#ccc"
                style={styles.input}
                value={customReason}
                onChangeText={setCustomReason}
              />
            )}

            <View style={styles.buttonRow}>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.cancelBtn}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={saveRecords}
                style={styles.saveBtn}
              >
                <Text style={styles.saveText}>Save</Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>
      {alert && (
        <CustomAlert
          type={alert.type}
          message={alert.msg}
          duration={2000}
          onHide={() => setAlert(null)}
        />
      )}
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
    marginHorizontal: 30,
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
  modalWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  modalBox: {
    width: "85%",
    backgroundColor: "#1c0e35",
    padding: 20,
    borderRadius: 15,
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  titleContainer: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    paddingVertical: '7',
    textAlign: "center",
  },

  input: {
    backgroundColor: "#381A65",
    padding: 12,
    color: "#fff",
    fontSize: 16,
    borderRadius: 10,
    marginBottom: 18,
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cancelBtn: {
    flex: 1,
    backgroundColor: "#555",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginRight: 10,
  },

  saveBtn: {
    flex: 1,
    backgroundColor: "#6b4ce6",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginLeft: 10,
  },

  cancelText: {
    color: "#fff",
    fontSize: 16,
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  toggleWrapper: {
    flexDirection: "row",
    backgroundColor: "#2d1750",
    padding: 4,
    borderRadius: 20,
    width: 140,
    justifyContent: "space-between",
  },

  sliderOption: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },

  activeSlide: {
    backgroundColor: "#6b4ce6",
  },

  sliderText: {
    color: "#b6b6b6",
    fontSize: 14,
    fontWeight: "600",
  },

  sliderTextActive: {
    color: "#fff",
    fontWeight: "700",
  },
  reasonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    marginTop: 10,
  },

  reasonButton: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#2d1750",
    marginHorizontal: 2,
  },

  reasonButtonSelected: {
    backgroundColor: "#a020f0",
  },

  reasonText: {
    color: "#fff",
    fontSize: 13,
  },

  reasonTextSelected: {
    fontWeight: "bold",
    color: "#fff",
  },


});

export default Home;