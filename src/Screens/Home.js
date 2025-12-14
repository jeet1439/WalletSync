import React, { useEffect, useState, useContext } from 'react';
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
  TextInput,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore, { Timestamp } from "@react-native-firebase/firestore";
import { Ionicons } from '@expo/vector-icons';
import CustomAlert from '../Components/CustomAlert';
import { UserContext } from '../context/UserContext';
import { StatusBar } from 'react-native';



const { width, height } = Dimensions.get("window");
const wp = (p) => (width * p) / 100;   // width percentage
const hp = (p) => (height * p) / 100; 

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

const TransactionItem = ({ item, onLongPress }) => (
   <TouchableOpacity
    activeOpacity={0.7}
    onLongPress={onLongPress}
    style={styles.transactionItem}
  >
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

  </TouchableOpacity>
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
  const [modalVisible, setModalVisible] = useState(false);
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("credit");
  const [reason, setReason] = useState("");
  const [showReasonList, setShowReasonList] = useState(false);
  const [customReason, setCustomReason] = useState("");

  const [records, setRecords] = useState([]);
  
  const [cardData, setCardData] = useState([]);
  
  const [filterType, setFilterType] = useState("month");  


  const navigation = useNavigation();
  const [alert, setAlert] = useState(null);
  const { userData } = useContext(UserContext);

  console.log(userData)

  const showAlert = (type, msg) => {
    setAlert({ type, msg });
  };

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
    if (!user) return () => {};

    const uid = user.uid;

    const now = new Date();
    const currentYear = now.getFullYear();

    let startDate;
    let endDate;

    if (filterType === "week") {
     
      const day = now.getDay(); 
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(now.setDate(diff));
      startDate.setHours(0, 0, 0, 0);

      
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 7);
    } else {
     
      const month = now.getMonth();
      startDate = new Date(currentYear, month, 1);
      endDate = new Date(currentYear, month + 1, 1);
    }

    return firestore()
      .collection("records")
      .doc(uid)
      .collection(currentYear.toString())
      .where("timestamp", ">=", startDate)
      .where("timestamp", "<", endDate)
      .orderBy("timestamp", "desc")
      .onSnapshot(snapshot => {
        if (!snapshot) return;

        const list = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setRecords(list);
      });

  } catch (error) {
    console.log(error);
    showAlert("error", "Something went wrong!");
  }
};

  const fetchMonthlyRecords = () => {
  try {
    const user = auth().currentUser;
    if (!user) return () => {};

    const uid = user.uid;
    const currentYear = new Date().getFullYear().toString();

    return firestore()
      .collection("records")
      .doc(uid)
      .collection(currentYear)
      .onSnapshot(snapshot => {

        if (!snapshot) return;  // <---

        const records = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        const monthlyData = {};
        const monthNames = [
          "January","February","March","April","May","June",
          "July","August","September","October","November","December"
        ];

        records.forEach(item => {
          if (!item.timestamp) return;
          const date = item.timestamp.toDate();
          const month = monthNames[date.getMonth()];

          if (!monthlyData[month]) {
            monthlyData[month] = { debit: 0, credit: 0 };
          }

          if (item.type === "credit") {
            monthlyData[month].credit += Number(item.amount);
          } else {
            monthlyData[month].debit += Number(item.amount);
          }
        });

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
      });

  } catch (error) {
    console.log(error);
    showAlert("error", "Something went wrong!");
  }
};

const deleteTransaction = (transactionId) => {
  Alert.alert(
    "Delete Transaction",
    "Are you sure you want to delete this transaction?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const user = auth().currentUser;
            if (!user) return;

            const uid = user.uid;
            const currentYear = new Date().getFullYear().toString();

            await firestore()
              .collection("records")
              .doc(uid)
              .collection(currentYear)
              .doc(transactionId)
              .delete();

            showAlert("success", "Transaction deleted");
          } catch (error) {
            console.log(error);
            showAlert("error", "Failed to delete transaction");
          }
        },
      },
    ]
  );
};


useEffect(() => {
  const unsub1 = fetchRecords();
  const unsub2 = fetchMonthlyRecords();

  return () => {
    if (unsub1) unsub1();
    if (unsub2) unsub2();
  };
}, [auth().currentUser, filterType]);




  return (
    <View style={styles.container}>
      <StatusBar
      translucent
      backgroundColor="transparent"
      barStyle="light-content"
    />

      <View style={styles.headerContainer}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={{ uri: 'https://i.pinimg.com/736x/ae/a7/a9/aea7a9551cda1f88cc5e6e7ea52709f1.jpg' }}
              style={styles.profileImage}
            />
          </TouchableOpacity>
          <View>
            <Text style={styles.helloText}>Hello,</Text>
            <Text style={styles.nameText}>{userData?.username} </Text>
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
          <TouchableOpacity 
              style={styles.lastWeekButton} 
              onPress={() => setFilterType(prev => prev === "month" ? "week" : "month")}
            >
              <Text style={styles.lastWeekText}>
                {filterType === "month" ? "This Month" : "This Week"}
              </Text>
            </TouchableOpacity>

        </View>
        <FlatList
          data={records}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TransactionItem
              item={item}
              onLongPress={() => deleteTransaction(item.id)}
            />
          )}
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
    paddingHorizontal: wp(5),
    paddingTop: hp(4),
  },

  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
    justifyContent: 'space-between',
  },

  profileImage: {
    width: wp(14),
    height: wp(14),
    borderRadius: wp(7),
    marginRight: wp(3),
  },

  helloText: {
    fontSize: wp(4),
    color: '#f3f3f3ff',
  },

  nameText: {
    fontSize: wp(5),
    fontWeight: '700',
    color: '#fff',
  },

  iconRow: {
    flexDirection: 'row',
    gap: wp(3),
  },

  iconButton: {
    backgroundColor: '#381a65',
    padding: wp(3),
    borderRadius: wp(8),
  },

  overviewSection: {
    width: width - wp(15),
    marginHorizontal: wp(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(1),
  },

  overviewTitle: {
    fontSize: wp(6),
    fontWeight: '700',
    color: '#fff',
  },

  overviewButton: {
    fontSize: wp(3.7),
    color: '#b6b6b6ff',
    fontWeight: '500',
  },

  flatListContainer: {
    height: hp(27),
    marginBottom: hp(2),
  },

  cardContainer: {
    marginHorizontal: wp(2),
    width: width - wp(12),
    height: hp(27),
    borderRadius: wp(5),
    padding: wp(5),
    overflow: "hidden",
  },

  cardImage: {
    borderRadius: wp(5),
    resizeMode: "cover",
  },

  monthText: {
    fontSize: wp(6),
    color: "#fff",
    fontWeight: "700",
  },

  bottomRow: {
    position: "absolute",
    bottom: hp(2),
    left: wp(5),
    right: wp(5),
    flexDirection: "row",
    justifyContent: "space-between",
  },

  label: {
    color: "#fff",
    fontSize: wp(3.7),
    opacity: 0.8,
  },

  value: {
    color: "#fff",
    fontSize: wp(5),
    fontWeight: "700",
  },

  transactionContainer: {
    position: "absolute",
    bottom: 0,
    height: "50%",
    width: width - wp(12),
    alignSelf: 'center',
    backgroundColor: "rgba(28, 14, 53, 0.85)",
    borderColor: "rgba(255, 255, 255, 0.2)",
    borderTopLeftRadius: wp(5),
    borderTopRightRadius: wp(5),
    paddingHorizontal: wp(5),
    paddingTop: hp(2),
  },

  transactionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: hp(2),
  },

  historyTitle: {
    fontSize: wp(6),
    fontWeight: '700',
    color: '#fff',
  },

  lastWeekButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#381A65',
    borderRadius: wp(5),
    paddingHorizontal: wp(4),
    paddingVertical: hp(0.7),
  },

  lastWeekText: {
    color: '#b6b6b6ff',
    fontSize: wp(3.7),
    fontWeight: '500',
  },

  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp(2),
  },

  transactionIcon: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(2),
    marginRight: wp(4),
  },

  transactionName: {
    color: "#fff",
    fontSize: wp(4),
    fontWeight: "600",
  },

  transactionType: {
    color: "#b6b6b6",
    fontSize: wp(3.4),
    marginTop: hp(0.3),
  },

  transactionAmount: {
    fontWeight: "700",
    fontSize: wp(4),
  },

  transactionTime: {
    color: "#b6b6b6",
    fontSize: wp(3),
    marginTop: hp(0.3),
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
    padding: wp(5),
    borderRadius: wp(4),
    elevation: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },

  modalTitle: {
    fontSize: wp(5),
    fontWeight: "700",
    color: "#fff",
    marginBottom: hp(1),
    textAlign: "center",
  },

  input: {
    backgroundColor: "#381A65",
    padding: wp(3.5),
    color: "#fff",
    fontSize: wp(4),
    borderRadius: wp(3),
    marginBottom: hp(2),
  },

  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  cancelBtn: {
    flex: 1,
    backgroundColor: "#555",
    paddingVertical: hp(1.5),
    borderRadius: wp(3),
    alignItems: "center",
    marginRight: wp(2),
  },

  saveBtn: {
    flex: 1,
    backgroundColor: "#6b4ce6",
    paddingVertical: hp(1.5),
    borderRadius: wp(3),
    alignItems: "center",
    marginLeft: wp(2),
  },

  cancelText: {
    color: "#fff",
    fontSize: wp(4),
  },

  saveText: {
    color: "#fff",
    fontSize: wp(4),
    fontWeight: "700",
  },

  toggleWrapper: {
    flexDirection: "row",
    backgroundColor: "#2d1750",
    padding: wp(1),
    borderRadius: wp(5),
    width: wp(38),
    justifyContent: "space-between",
  },

  sliderOption: {
    flex: 1,
    paddingVertical: hp(1),
    borderRadius: wp(5),
    alignItems: "center",
  },

  activeSlide: {
    backgroundColor: "#6b4ce6",
  },

  sliderText: {
    color: "#b6b6b6",
    fontSize: wp(3.5),
    fontWeight: "600",
  },

  sliderTextActive: {
    color: "#fff",
    fontWeight: "700",
  },

  reasonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: hp(2),
    marginTop: hp(1),
  },

  reasonButton: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderRadius: wp(3),
    backgroundColor: "#2d1750",
  },

  reasonButtonSelected: {
    backgroundColor: "#a020f0",
  },

  reasonText: {
    color: "#fff",
    fontSize: wp(3.5),
  },

  reasonTextSelected: {
    fontWeight: "700",
  },
});
export default Home;