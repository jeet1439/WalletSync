import React from "react";
import { StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import Home from "../Screens/Home";
import Analetics from "../Screens/Analetics";
import Profile from "../Screens/Profile";
import Settings from "../Screens/Settings";

const Tab = createBottomTabNavigator();

export default function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: {
        fontSize: 12,
        marginBottom: 5,
        color: "#A98BE8",
        marginTop: 5,
      },
        tabBarIcon: ({ focused }) => {
          const color = focused ? "#f5f5f5ff" : "#582bb8ff";
          const size = 28;

          switch (route.name) {
            case "Home":
              return (
                <MaterialCommunityIcons
                  name={focused ? "home" : "home-outline"}
                  size={size}
                  color={color}
                />
              );

            case "Analetics":
              return (
                <MaterialCommunityIcons
                  name="chart-bar"
                  size={size - 3}
                  color={color}
                />
              );

            case "Profile":
              return (
                <MaterialCommunityIcons
                  name={focused ? "account" : "account-outline"}
                  size={size}
                  color={color}
                />
              );

            case "Settings":
              return (
                <MaterialCommunityIcons
                  name={focused ? "cog" : "cog-outline"}
                  size={size}
                  color={color}
                />
              );
          }
        },
      })}
      
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Analetics" component={Analetics} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Settings" component={Settings} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
    tabBar: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    height: 70,

    backgroundColor: "#0b051dff",   
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",     

    shadowColor: "#9e8cdbff",
    shadowOffset: { width: -2, height: -2 },
    shadowOpacity: 0.002,
    shadowRadius: 10,
    paddingTop: 4,
  },
});
