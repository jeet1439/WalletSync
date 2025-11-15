import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from "@react-native-firebase/firestore";

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
        <View style={{flexDirection: 'row'}}>
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

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E2E8F0',
    textAlign: 'center',
    marginBottom: 30,
  },

  button: {
    backgroundColor: '#7F00FF',
    width: '80%',
    padding: 15,
    borderRadius: 12,
    alignSelf: 'center',
    alignItems: 'center',
    shadowColor: '#7F00FF',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },

  buttonText: {
    color: '#E2E8F0',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default Home;
