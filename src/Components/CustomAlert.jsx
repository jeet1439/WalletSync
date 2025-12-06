import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StyleSheet } from "react-native";

const CustomAlert = ({ type = "info", message, duration = 2000, onHide }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;

  // Colors based on alert type
  const getColor = () => {
    switch (type) {
      case "success":
        return "#2ecc71";
      case "error":
        return "#e74c3c";
      case "info":
      default:
        return "#a020f0";
    }
  };

  useEffect(() => {
    // Slide in
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Slide out after duration
    const timer = setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        onHide && onHide();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View
      style={[
        styles.alertContainer,
        { transform: [{ translateY: slideAnim }], backgroundColor: getColor() },
      ]}
    >
      <Text style={styles.alertText}>{message}</Text>
    </Animated.View>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  alertContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingVertical: 15,
    paddingHorizontal: 20,
    zIndex: 999,
  },
  alertText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
