import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

export default function BetHistory() {
  const { currentUser } = useAuth();
  const [bets, setBets] = useState([]);
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");

  useEffect(() => {
    if (!currentUser) return;
    const q = query(collection(db, "bets"), where("userId", "==", currentUser.uid), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      const arr = snap.docs.map(d => ({ id: d.id, ...d.data(), createdAt: d.data().createdAt?.toDate?.() || null }));
      setBets(arr);
    });
    return () => unsub();
  }, [currentUser]);

  const filtered = bets.filter(b => {
    if (!filterFrom && !filterTo) return true;
    const created = b.createdAt ? b.createdAt.getTime() : 0;
    if (filterFrom) {
      const from = new Date(filterFrom).getTime();
      if (created < from) return false;
    }
    if (filterTo) {
      // include whole day
      const to = new Date(filterTo);
      to.setHours(23,59,59,999);
      if (created > to.getTime()) return false;
    }
    return true;
  });

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-xl font-bold mb-3">Zgodovina stav</h3>

      <div className="flex gap-2 mb-3">
        <label>Od: <input type="date" value={filterFrom} onChange={e=>setFilterFrom(e.target.value)} /></label>
        <label>Do: <input type="date" value={filterTo} onChange={e=>setFilterTo(e.target.value)} /></label>
      </div>

      <table className="w-full text-left">
        <thead>
          <tr><th>Datum</th><th>Tekma</th><th>Tip</th><th>Znesek</th><th>Kvote</th><th>Pot. dobitek</th><th>Status</th></tr>
        </thead>
        <tbody>
          {filtered.map(b => (
            <tr key={b.id} className="border-b">
              <td className="p-2">{b.createdAt ? b.createdAt.toLocaleString() : "-"}</td>
              <td className="p-2">{b.matchLabel}</td>
              <td className="p-2">{b.betType}</td>
              <td className="p-2">{b.amount}</td>
              <td className="p-2">{b.odds}</td>
              <td className="p-2">{b.potentialReturn}</td>
              <td className="p-2">{b.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
