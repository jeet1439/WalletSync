import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { View, ActivityIndicator, ImageBackground, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import auth from "@react-native-firebase/auth";
import Login from "./src/Login";
import Details from "./src/Details";
import Tabs from "./src/Navigator/Tabs";



import UserProvider from "./src/context/UserContext";
import { UserContext } from "./src/context/UserContext";
import Privacy from "./src/Screens/Privacy";




const Stack = createStackNavigator();

function MainApp () {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
 

  useEffect(() => {
  const unsubscribe = auth().onAuthStateChanged((currentUser) => {
    setUser(currentUser);

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  });

  return unsubscribe;
}, []);

if (loading) {
  return (
    <ImageBackground
      source={require("./assets/images/splash.png")}
      style={{
        flex: 1,
        width: "100%",
        height: "100%",
        justifyContent: "flex-end",  
        alignItems: "center",
      }}
      resizeMode="cover"
    >
      <View
        style={{
          position: "absolute",
          bottom: 100,  
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "#fff",
            fontSize: 48,
            fontWeight: "500",
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          WalletSync
        </Text>

        <Text
          style={{
            color: "#d4d4d4",
            fontSize: 20,
            textAlign: "center",
            width: "90%",
          }}
        >
          Sync your finances effortlessly
        </Text>
      </View>
    </ImageBackground>
  );
}

  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: '#0b051dff' }} >
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={user ? "Dashboard" : "Login"}
        screenOptions={{ headerShown: false }}
      >
        {!user ? (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Details" component={Details} />
          </>
        ) : (
          <Stack.Screen name="Dashboard" component={Tabs} />
        )}
        <Stack.Screen 
        name="Privacy" 
        component={Privacy} 
        options={{ headerShown: false }} 
      />
      </Stack.Navigator>
    </NavigationContainer>
    </SafeAreaView>
  );
} 

export default function App() {
  return (
    <UserProvider>
      <MainApp />
    </UserProvider>
  );
}

