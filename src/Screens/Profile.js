import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Switch,
  TextInput,
  Alert,
} from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "../context/UserContext";
import CustomAlert from "../Components/CustomAlert";

const Profile = () => {
  const navigation = useNavigation();
  const user = auth().currentUser;
  const { userData } = useContext(UserContext);

  const [autoRead, setAutoRead] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
 
    const [alert, setAlert] = useState(null);

    const showAlert = (type, msg) => {
      setAlert({ type, msg });
    };


  useEffect(() => {
    if (userData?.username) {
      setEditedName(userData.username);
    }
  }, [userData]);

  const handleSaveName = async () => {
    if (!editedName.trim()) {
      showAlert("error", `Name cannot be empty!`);
      return;
    }

    try {
      await firestore()
        .collection("users")
        .doc(user.uid)
        .update({
          username: editedName,
        });

      setIsEditing(false);
      showAlert("success", `Name updated successfully!`);
    } catch (error) {
      console.log(error);
      showAlert("error", `Failed to update name!`);
    }
  };

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
      {/* Header */}
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.headerText}>Profile</Text>

        <TouchableOpacity
          onPress={isEditing ? handleSaveName : () => setIsEditing(true)}
        >
          <Ionicons
            name={isEditing ? "checkmark" : "pencil"}
            size={22}
            color="#fff"
          />
        </TouchableOpacity>
      </View>

      {/* Profile Info */}
      <View style={styles.profileContainer}>
        <TouchableOpacity>
          <Image
            source={{
              uri:
                user?.photoURL ||
                "https://i.pinimg.com/736x/ae/a7/a9/aea7a9551cda1f88cc5e6e7ea52709f1.jpg",
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>

        {isEditing ? (
          <TextInput
            value={editedName}
            onChangeText={setEditedName}
            style={styles.nameInput}
            placeholder="Enter your name"
            placeholderTextColor="#9CA3AF"
          />
        ) : (
          <Text style={styles.name}>{userData?.username || "Loading..."}</Text>
        )}

        <Text style={styles.email}>{userData?.email}</Text>
      </View>

      {/* General Settings */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>General settings</Text>

        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowLabel}>Language</Text>
          <Text style={styles.rowValue}>English</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowLabel}>Theme</Text>
          <Text style={styles.rowValue}>Dark</Text>
        </TouchableOpacity>
      </View>

      {/* Card Settings */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Card settings</Text>

        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowLabel}>Change your pin</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.row}>
          <Text style={styles.rowLabel}>Get your data</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Auto read transactions</Text>
          <Switch
            value={autoRead}
            onValueChange={setAutoRead}
            thumbColor="#7F00FF"
          />
        </View>

        <TouchableOpacity style={styles.row} onPress={handleSignOut}>
          <Text style={[styles.rowLabel, { color: "#f87171" }]}>
            Sign out
          </Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>
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

export default Profile;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0b051dff",
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerText: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
  },

  profileContainer: {
    alignItems: "center",
    marginTop: 20,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 50,
    marginBottom: 10,
  },

  name: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  nameInput: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
    borderBottomWidth: 1,
    borderBottomColor: "#7F00FF",
    paddingVertical: 2,
    minWidth: 150,
    textAlign: "center",
  },

  email: {
    color: "#9CA3AF",
    fontSize: 14,
    marginTop: 4,
  },

  card: {
    backgroundColor: "rgba(28, 14, 53, 0.85)",
    padding: 18,
    borderRadius: 16,
    marginTop: 25,
  },

  cardTitle: {
    color: "#E2E8F0",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 15,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  rowLabel: {
    color: "#cbd5e1",
    fontSize: 15,
  },

  rowValue: {
    color: "#9CA3AF",
    fontSize: 15,
  },
});
