import React, { createContext, useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeFirestore = null;

    const unsubscribeAuth = auth().onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setLoading(true);
        unsubscribeFirestore = firestore()
          .collection("users")
          .doc(currentUser.uid)
          .onSnapshot(
            (doc) => {
              if (!doc.exists) {
                console.log("User document does NOT exist in Firestore");
                setUserData(null);
              } else {
                setUserData(doc.data());
              }
              setLoading(false);
            },
            (error) => {
              console.log("Firestore listener error:", error);
              setLoading(false);
            }
          );
      } else {
        // When logged out
        setUserData(null);
        setLoading(false);
      }
    });

    // Cleanup both listeners
    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) unsubscribeFirestore();
    };
  }, []);

  return (
    <UserContext.Provider value={{ userData, loading }}>
      {children}
    </UserContext.Provider>
  );
}
