import React, { useEffect, useState } from "react";
import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export default function FavoriteButton({ teamName }) {
  const { currentUser, profile } = useAuth();
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    if (profile?.favorites) setIsFav(profile.favorites.includes(teamName));
    else setIsFav(false);
  }, [profile, teamName]);

  const toggleFav = async () => {
    if (!currentUser) return alert("Prijavi se, da lahko dodaš priljubljene.");

    const userRef = doc(db, "users", currentUser.uid);
    try {
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, { favorites: [teamName], balance: 0, createdAt: new Date().toISOString() }, { merge: true });
        setIsFav(true); // takoj posodobi stanje
        return;
      }
      if (!isFav) {
        await updateDoc(userRef, { favorites: arrayUnion(teamName) });
        setIsFav(true);
      } else {
        await updateDoc(userRef, { favorites: arrayRemove(teamName) });
        setIsFav(false);
      }
    } catch (err) {
      console.error("Fav toggle err:", err);
      alert("Napaka pri posodabljanju priljubljenih.");
    }
  };

  return (
    <button 
      onClick={toggleFav} 
      className={`px-2 py-1 rounded transition ${isFav ? "bg-yellow-400" : "bg-gray-200"}`}
      title={isFav ? "Odstrani iz priljubljenih" : "Dodaj med priljubljene"}
    >
      {isFav ? "★" : "☆"} 
    </button>
  );
}
