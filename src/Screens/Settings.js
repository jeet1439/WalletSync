import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  Alert,
  Dimensions
} from "react-native";
import auth from "@react-native-firebase/auth";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";

const { width, height } = Dimensions.get("window");
const wp = p => (width * p) / 100;
const hp = p => (height * p) / 100;

const Settings = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const { userData } = useContext(UserContext);

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      Alert.alert("Signed Out", "You have been signed out successfully.");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>

      {/* Profile card */}
      <View style={styles.profileCard}>
        <Image
          source={{
            uri:
              "https://i.pinimg.com/736x/ae/a7/a9/aea7a9551cda1f88cc5e6e7ea52709f1.jpg"
          }}
          style={styles.avatar}
        />

        <View>
          <Text style={styles.name}>{userData?.username || "User"}</Text>
          <Text style={styles.email}>{userData?.email || "example@gmail.com"}</Text>
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="notifications" size={wp(5.5)} color="#f1f1f1ff" />
            <Text style={styles.rowText}>Notifications</Text>
          </View>
          <Switch value={notifications} onValueChange={setNotifications} thumbColor="#7F00FF" />
        </View>

        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="moon" size={wp(5.5)} color="#f1f1f1ff" />
            <Text style={styles.rowText}>Dark Mode</Text>
          </View>
          <Switch value={darkMode} onValueChange={setDarkMode} thumbColor="#7F00FF" />
        </View>
      </View>

      {/* Account */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>

        <TouchableOpacity
          onPress={() => navigation.navigate("Profile")}
          style={styles.row}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="person" size={wp(5.5)} color="#f1f1f1ff" />
            <Text style={styles.rowText}>Edit Profile</Text>
          </View>
          <Ionicons name="chevron-forward" size={wp(5.5)} color="#f1f1f1ff" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Privacy")}
          style={styles.row}
        >
          <View style={styles.rowLeft}>
            <Ionicons name="shield-checkmark" size={wp(5.5)} color="#f1f1f1ff" />
            <Text style={styles.rowText}>Privacy & Security</Text>
          </View>
          <Ionicons name="chevron-forward" size={wp(5.5)} color="#d3d3d3ff" />
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={wp(5.5)} color="#fff" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>

      {/* Bottom padding (to avoid hiding under bottom tab bar) */}
      <View style={{ height: hp(5) }} />
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b051dff",
    paddingHorizontal: wp(5),
    paddingTop: hp(4)
  },

  header: {
    color: "#fff",
    fontSize: wp(8),
    fontWeight: "700",
    marginBottom: hp(2)
  },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(28, 14, 53, 0.85)",
    padding: wp(5),
    borderRadius: wp(4),
    marginBottom: hp(3)
  },

  avatar: {
    width: wp(18),
    height: wp(18),
    borderRadius: wp(9),
    marginRight: wp(4)
  },

  name: {
    color: "#fff",
    fontSize: wp(5),
    fontWeight: "600"
  },

  email: {
    color: "#b6b3cc",
    fontSize: wp(3.5),
    marginTop: hp(0.5)
  },

  section: {
    marginBottom: hp(3)
  },

  sectionTitle: {
    color: "#8c87b3",
    fontSize: wp(4),
    marginBottom: hp(1)
  },

  row: {
    backgroundColor: "rgba(28, 14, 53, 0.85)",
    padding: wp(4),
    borderRadius: wp(3),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: hp(1.2)
  },

  rowLeft: {
    flexDirection: "row",
    alignItems: "center"
  },

  rowText: {
    color: "#fff",
    fontSize: wp(4),
    marginLeft: wp(3)
  },

  logoutButton: {
    backgroundColor: "#6a4cff",
    paddingVertical: hp(1.8),
    borderRadius: wp(3),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },

  logoutText: {
    color: "#fff",
    fontSize: wp(4.5),
    marginLeft: wp(2),
    fontWeight: "500"
  }
});
