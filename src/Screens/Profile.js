import React, { useEffect, useState } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, Image, Switch 
} from "react-native";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Profile = () => {
  const [name, setName] = useState("");
  const user = auth().currentUser;
  const navgation = useNavigation();

  useEffect(() => {
    const uid = user.uid;
    firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then(doc => {
        if (doc.exists) {
          setName(doc.data().username);
        }
      });
  }, []);

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
      <View style={styles.headerRow}>
      <TouchableOpacity
      onPress={() => navgation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>  
        <Text style={styles.headerText}>Profile</Text>
        <Ionicons name="pencil" size={22} color="#fff" />
      </View>
      {/* Profile Section */}
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Image 
          source={{ uri: user.photoURL || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuNhTZJTtkR6b-ADMhmzPvVwaLuLdz273wvQ&s" }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{name || "Loading..."}</Text>
        <Text style={styles.email}>{user.email}</Text>
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
          <Text style={styles.rowLabel}>Allow transaction</Text>
          <Switch value={false} thumbColor="#7F00FF" />
        </View>
        <TouchableOpacity style={styles.row} onPress={handleSignOut}>
          <Text style={styles.rowLabel}>Sign out</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b051dff',
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

  email: {
    color: "#9CA3AF",
    fontSize: 14,
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

  button: {
    backgroundColor: "#7F00FF",
    width: "85%",
    padding: 15,
    borderRadius: 15,
    alignSelf: "center",
    alignItems: "center",
    marginTop: 40,
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default Profile;
