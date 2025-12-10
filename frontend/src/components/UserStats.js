// src/components/UserStats.js
import React, { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const UserStats = () => {
  const [bets, setBets] = useState([]);
  const [monthly, setMonthly] = useState([]);

  useEffect(() => {
    const fetchBets = async () => {
      const user = auth.currentUser;
      if (!user) return;
      const q = query(collection(db, "bets"), where("userId", "==", user.uid));
      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => doc.data());
      setBets(data);

      // Pretvori v mesečno statistiko
      const grouped = {};
      data.forEach((b) => {
        const month = new Date(b.createdAt?.seconds * 1000)
          .toISOString()
          .slice(0, 7);
        grouped[month] = grouped[month] || { month, total: 0, count: 0 };
        grouped[month].total += b.amount || 0;
        grouped[month].count++;
      });
      setMonthly(Object.values(grouped));
    };

    fetchBets();
  }, []);

  const successRate =
    bets.length > 0
      ? Math.round(
          (bets.filter((b) => b.status === "Zadeta").length / bets.length) * 100
        )
      : 0;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow mt-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        Moja statistika
      </h2>
      <p className="text-center mb-4">
        Uspešnost stav:{" "}
        <span className="font-bold text-green-600">{successRate}%</span>
      </p>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={monthly}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="total" stroke="#2563eb" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserStats;
