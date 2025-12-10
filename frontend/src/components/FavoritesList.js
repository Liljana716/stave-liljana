import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { doc, updateDoc, arrayUnion, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import LiveBoard from "./LiveBoard";

export default function FavoritesList() {
  const { profile, currentUser } = useAuth();
  const favorites = profile?.favorites || [];

  const [newTeam, setNewTeam] = useState("");
  const [loading, setLoading] = useState(false);

  const addFavoriteTeam = async () => {
    if (!newTeam.trim()) return alert("Vnesi ime ekipe!");
    if (!currentUser) return alert("Prijavi se, da lahko dodaš priljubljene.");

    setLoading(true);

    const userRef = doc(db, "users", currentUser.uid);

    try {
      // Preverimo, če user dokument obstaja
      const snap = await getDoc(userRef);
      if (!snap.exists()) {
        await setDoc(userRef, { favorites: [newTeam], balance: 0, createdAt: new Date().toISOString() }, { merge: true });
      } else {
        await updateDoc(userRef, { favorites: arrayUnion(newTeam) });
      }
      setNewTeam(""); // počistimo input
    } catch (err) {
      console.error("Napaka pri dodajanju ekipe med priljubljene:", err);
      alert("Napaka pri dodajanju ekipe.");
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto mt-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Priljubljene ekipe</h2>

      {/* Vnos nove ekipe */}
      <div className="flex gap-2 mb-6 justify-center">
        <input
          type="text"
          value={newTeam}
          onChange={(e) => setNewTeam(e.target.value)}
          placeholder="Vnesi ime ekipe"
          className="border rounded px-3 py-2 w-64"
        />
        <button
          onClick={addFavoriteTeam}
          disabled={loading}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          {loading ? "Dodajam..." : "Dodaj ekipo"}
        </button>
      </div>

      {favorites.length === 0 && (
        <p className="text-center text-gray-500 italic mb-4">
          Ni priljubljenih ekip. Dodaj jih z vnosnim poljem ali z zvezdico ob tekmi.
        </p>
      )}

      {/* Prikaz tekem samo za priljubljene */}
      <LiveBoard filterTeams={favorites} />
    </div>
  );
}
