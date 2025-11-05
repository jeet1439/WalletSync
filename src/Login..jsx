import React, { useState} from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  return (
    <View>
      <Text>Login</Text>
    </View>
  )
}