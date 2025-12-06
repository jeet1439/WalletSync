import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
} from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Settings = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  // Fetch user data
  const user = auth().currentUser;

  useEffect(() => {
    const uid = user.uid;
    firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          setUserData(doc.data());
        }
      });
  }, []);
 

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      Alert.alert("Signed Out", "You have been signed out successfully.");
      // navigation.replace("Login");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      <View style={styles.profileCard}>
        <Image
          source={{
            uri:
              userData?.profileImage ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
          style={styles.avatar}
        />
        <View>
          <Text style={styles.name}>{userData?.username || "User"}</Text>
          <Text style={styles.email}>{userData?.email || "example@gmail.com"}</Text>
        </View>
      </View>

      {/* Switch Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="notifications" size={22} color="#f1f1f1ff" />
            <Text style={styles.rowText}>Notifications</Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            thumbColor="#7F00FF"
          />
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="moon" size={22} color="#f1f1f1ff" />
            <Text style={styles.rowText}>Dark Mode</Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            thumbColor="#7F00FF"
          />
        </View>
      </View>

      {/* Account Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="person" size={22} color="#f1f1f1ff" />
            <Text style={styles.rowText}>Edit Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#f1f1f1ff" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="shield-checkmark" size={22} color="#f1f1f1ff" />
            <Text style={styles.rowText}>Privacy & Security</Text>
          </View>
          <Ionicons name="chevron-forward" size={22} color="#d3d3d3ff" />
        </TouchableOpacity>
      </View>

      {/* Sign Out */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={22} color="#fff" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b051dff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  header: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(28, 14, 53, 0.85)",
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 15,
  },

  name: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "600",
  },

  email: {
    color: "#b6b3cc",
    marginTop: 3,
  },

  section: {
    marginBottom: 25,
  },

  sectionTitle: {
    color: "#8c87b3",
    fontSize: 16,
    marginBottom: 10,
  },

  row: {
    backgroundColor: "rgba(28, 14, 53, 0.85)",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  rowText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },

  logoutButton: {
    backgroundColor: "#6a4cff",
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutText: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 8,
    fontWeight: "500",
  },
});
