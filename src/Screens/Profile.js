import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import auth from '@react-native-firebase/auth';


const Profile = () => {
  const handleSignOut = async () => {
      try {
        await auth().signOut();
        Alert.alert('Signed Out', 'You have been signed out successfully.');
      } catch (error) {
        console.log('Error signing out:', error);
        Alert.alert('Error', 'Failed to sign out. Please try again.');
      }
    };
  return (
    <View style={styles. container}>
      <Text>Profile</Text>
      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0b051dff',
    paddingHorizontal: 20,
    paddingTop: 50,
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


export default Profile