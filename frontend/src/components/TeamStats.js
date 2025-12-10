// src/components/TeamStats.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

const TeamStats = ({ teamName }) => {
  const [matches, setMatches] = useState([]);
  const [ratio, setRatio] = useState(null);

  useEffect(() => {
    if (!teamName) return;
    const fetchStats = async () => {
      try {
        // Zadnjih 10 tekem
        const q = query(
          collection(db, "teamStats"),
          where("team", "==", teamName),
          orderBy("date", "desc"),
          limit(10)
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => doc.data());

        setMatches(data.slice(0, 5)); // zadnjih 5 za tabelo

        const wins = data.filter((m) => m.result === "Zmaga").length;
        const losses = data.filter((m) => m.result === "Poraz").length;
        setRatio({ wins, losses });
      } catch (e) {
        console.error("Napaka pri nalaganju statistik:", e);
      }
    };

    fetchStats();
  }, [teamName]);

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Statistika ekipe: {teamName}
      </h2>

      {ratio && (
        <div className="text-center mb-4">
          <p className="font-semibold">
            Zmage: <span className="text-green-600">{ratio.wins}</span> | Porazi:{" "}
            <span className="text-red-600">{ratio.losses}</span>
          </p>
        </div>
      )}

      <table className="w-full text-sm border rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Datum</th>
            <th className="p-2 text-left">Nasprotnik</th>
            <th className="p-2 text-left">Rezultat</th>
          </tr>
        </thead>
        <tbody>
          {matches.map((m, i) => (
            <tr key={i} className="border-t">
              <td className="p-2">{m.date}</td>
              <td className="p-2">{m.opponent}</td>
              <td
                className={`p-2 ${
                  m.result === "Zmaga" ? "text-green-600" : "text-red-600"
                }`}
              >
                {m.result}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TeamStats;
