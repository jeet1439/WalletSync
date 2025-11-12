import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';

export default function Details() {
  const [username, setUsername] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const navigation = useNavigation();
  const route = useRoute();
  const { uid } = route.params || {};

  const handleContinue = async () => {
    if (!username || !dob || !email) {
      Alert.alert('Missing Info', 'Please fill out all fields.');
      return;
    }

    try {
      await firestore().collection('users').doc(uid).set({
        username,
        dob,
        email,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Success', 'Profile created successfully!');
      navigation.navigate('Dashboard');
    } catch (error) {
      console.error('Error saving details:', error);
      Alert.alert('Error', 'Something went wrong while saving your data.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Please provide your details to continue
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Username"
          placeholderTextColor="#94A3B8"
          value={username}
          onChangeText={setUsername}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Date of Birth (DD/MM/YYYY)"
          placeholderTextColor="#94A3B8"
          value={dob}
          onChangeText={setDob}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Email ID"
          placeholderTextColor="#94A3B8"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b051dff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  innerContainer: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 8,
  },
  input: {
    width: '90%',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    marginVertical: 10,
    backgroundColor: '#1E293B',
    color: '#E2E8F0',
  },
  button: {
    backgroundColor: '#7F00FF',
    width: '90%',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#7F00FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#E2E8F0',
    fontSize: 18,
    fontWeight: '600',
  },
});
