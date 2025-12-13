import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirm, setConfirm] = useState(null);
  const navigation = useNavigation();
  const [codesent, setCodeSent] = useState(false);

  const signInWithPhoneNumber = async () => {
    try {
      setCodeSent(true);
      const fullPhone = `+91${phone}`;
      const confirmation = await auth().signInWithPhoneNumber(fullPhone);
      setConfirm(confirmation);
      setCodeSent(false);
    } catch (err) {
      setCodeSent(false);
      console.log('Error sending code:', err);
    }
  };

  const confirmCode = async () => {
    try {
      setCodeSent(true);
      const userCredential = await confirm.confirm(code);
      const user = userCredential.user;

      const userDoc = await firestore().collection('users').doc(user.uid).get();
      setCodeSent(false);

      if (userDoc.exists && userDoc.data()) {
        navigation.navigate("Dashboard");
      } else {
        navigation.navigate("Details", { uid: user.uid });
      }

    } catch (error) {
      setCodeSent(false);
      console.log('Invalid code');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {!confirm ? (
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Enter your phone number to continue</Text>

          <View style={styles.phoneRow}>
            <View style={styles.prefixBox}>
              <Text style={styles.prefixText}>+91</Text>
            </View>

            <TextInput
              style={styles.phoneInput}
              placeholder="Enter your number"
              placeholderTextColor="#888"
              keyboardType="number-pad"
              maxLength={10}
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <TouchableOpacity 
            disabled={codesent}
            style={styles.button}
            onPress={signInWithPhoneNumber}
          >
            <Text style={styles.buttonText}>
              {codesent ? (
                <ActivityIndicator size={'small'} color={'#fff'} />
              ) : 'Get OTP'}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.innerContainer}>
          <Text style={styles.title}>Verify Code</Text>
          <Text style={styles.subtitle}>Enter the code sent to your number</Text>

          <View style={styles.otpContainer}>
            {Array(6).fill(0).map((_, i) => (
              <View key={i} style={styles.otpBox}>
                <Text style={styles.otpText}>{code[i] || ''}</Text>
              </View>
            ))}
          </View>

          <TextInput
            style={styles.hiddenInput}
            keyboardType="number-pad"
            maxLength={6}
            value={code}
            onChangeText={setCode}
            autoFocus
          />

          <TouchableOpacity style={styles.button} onPress={confirmCode}>
            <Text style={styles.buttonText}>
              {codesent ? (
                <ActivityIndicator size={'small'} color={'#fff'} />
              ) : 'Verify'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setConfirm(null)}>
            <Text style={styles.resendText}>Resend Code</Text>
          </TouchableOpacity>
        </View>
      )}
    </KeyboardAvoidingView>
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
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginBottom: 20,
  },
  phoneRow: {
    flexDirection: 'row',
    width: '90%',
    alignItems: 'center',
  },
  prefixBox: {
    padding: 14,
    backgroundColor: '#1E293B',
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  prefixText: {
    fontSize: 16,
    color: '#E2E8F0',
    fontWeight: '600'
  },
  phoneInput: {
    flex: 1,
    padding: 14,
    backgroundColor: '#1E293B',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    color: '#E2E8F0',
    fontSize: 16,
  },

  button: {
    backgroundColor: '#7F00FF',
    width: '90%',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
    shadowColor: '#6028e4ff',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '600',
  },

  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginBottom: 20,
  },
  otpBox: {
    width: 45,
    height: 50,
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1E293B',
  },
  otpText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#F8FAFC',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
  },
  resendText: {
    color: '#818CF8',
    fontSize: 15,
    marginTop: 20,
    fontWeight: '500',
  },
});
