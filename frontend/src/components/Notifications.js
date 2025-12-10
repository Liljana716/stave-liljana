// src/components/Notifications.js
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, doc, setDoc, getDoc } from "firebase/firestore";

const Notifications = ({ favorites = [] }) => {
  const [settings, setSettings] = useState({});

  useEffect(() => {
    const loadSettings = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const ref = doc(db, "notifications", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) setSettings(snap.data());
    };
    loadSettings();
  }, []);

  const toggleNotification = async (team) => {
    const user = auth.currentUser;
    if (!user) return;
    const updated = { ...settings, [team]: !settings[team] };
    setSettings(updated);
    await setDoc(doc(db, "notifications", user.uid), updated);
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow mt-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Obvestila o priljubljenih ekipah
      </h2>
      {favorites.length === 0 ? (
        <p className="text-gray-500 text-center">Ni dodanih ekip.</p>
      ) : (
        <ul>
          {favorites.map((team) => (
            <li key={team} className="flex justify-between py-2 border-b">
              <span>{team}</span>
              <button
                onClick={() => toggleNotification(team)}
                className={`px-3 py-1 rounded text-sm ${
                  settings[team]
                    ? "bg-green-600 text-white"
                    : "bg-gray-300 text-gray-800"
                }`}
              >
                {settings[team] ? "Vključeno" : "Izključeno"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
