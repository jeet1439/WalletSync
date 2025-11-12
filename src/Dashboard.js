import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

export default function Dashboard() {
  const navigation = useNavigation();

  const handleSignOut = async () => {
    try {
      await auth().signOut();
      Alert.alert('Signed Out', 'You have been signed out successfully.');
      navigation.replace('Login');
    } catch (error) {
      console.log('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#E2E8F0',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#7F00FF',
    width: '80%',
    padding: 15,
    borderRadius: 12,
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
