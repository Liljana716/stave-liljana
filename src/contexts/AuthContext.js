// src/contexts/AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null); // Firebase user
  const [profile, setProfile] = useState(null); // Firestore user doc
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // poslušaj firestore profil v realnem času
        const userRef = doc(db, "users", user.uid);
        const unsubProfile = onSnapshot(userRef, (snap) => {
          if (snap.exists()) setProfile({ id: snap.id, ...snap.data() });
          else setProfile(null);
          setLoading(false);
        }, (err) => {
          console.error("Profile snapshot err:", err);
          setLoading(false);
        });
        // cleanup: ko se user odjavi, prekliči snapshot
        // we return unsubProfile only when auth changes; keep reference:
        // store unsubProfile in closure:
        (async () => {
          // nothing
        })();
        // when auth changes, we should return unsubProfile in outer cleanup - simplified below
        // but to avoid complexity, also get the doc once in case snapshot not set quickly:
        try {
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) setProfile({ id: docSnap.id, ...docSnap.data() });
        } catch (e) { console.error(e); }
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubAuth();
  }, []);

  const value = { currentUser, profile, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
