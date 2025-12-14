import React, { createContext, useState, useEffect } from "react";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeFirestore = null;

    const unsubscribeAuth = auth().onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setLoading(true);

        unsubscribeFirestore = firestore()
          .collection("users")
          .doc(currentUser.uid)
          .onSnapshot(
            (doc) => {
              if (doc.exists) {
                const data = doc.data();
                setUserData(data);
                // console.log("User data:", data); 
              } else {
                console.log("User document does not exist");
                setUserData(null);
              }
              setLoading(false);
            },
            (error) => {
              console.log("Firestore listener error:", error);
              setLoading(false);
            }
          );
      } else {
        // logout
        if (unsubscribeFirestore) {
          unsubscribeFirestore();
          unsubscribeFirestore = null;
        }
        setUserData(null);
        setLoading(false);
      }
    });

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
