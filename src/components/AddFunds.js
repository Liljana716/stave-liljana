import React, { useState } from "react";
import { doc, runTransaction, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

/*
  Simuliran checkout: v produkciji povežeš PayPal/Stripe.
  Tu izvedemo transakcijo, ki poveča user.balance in zabeleži transakcijo v payments kolekciji.
*/

export default function AddFunds() {
  const { currentUser } = useAuth();
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("paypal");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!currentUser) return alert("Prijavi se.");
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) return alert("Vnesi veljaven znesek.");
    setLoading(true);

    try {
      const userRef = doc(db, "users", currentUser.uid);
await runTransaction(db, async (tx) => {
  const snap = await tx.get(userRef);
  const balance = snap.exists() ? (snap.data().balance || 0) : 0;
  tx.set(userRef, { balance: balance + parsed }, { merge: true }); // ← merge: true omogoča update ali create

  // zabeleži plačilo
  const paymentsRef = doc(db, "payments", `${currentUser.uid}_${Date.now()}`);
  tx.set(paymentsRef, {
    userId: currentUser.uid,
    amount: parsed,
    method,
    createdAt: serverTimestamp(),
    status: "completed"
  });
});


      setLoading(false);
      setAmount("");
      alert("Sredstva so bila dodana na račun (simulacija).");
    } catch (err) {
      setLoading(false);
      console.error("AddFunds err:", err);
      alert("Napaka pri dodajanju sredstev.");
    }
  };

  return (
    <form onSubmit={handleAdd} className="p-4 bg-white rounded shadow max-w-md">
      <h3 className="text-lg font-semibold mb-2">Dodaj sredstva</h3>
      <div className="mb-2">
        <label className="mr-2">Znesek:</label>
        <input type="number" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
      </div>
      <div className="mb-2">
        <label className="mr-2">Način plačila:</label>
        <select value={method} onChange={(e)=>setMethod(e.target.value)}>
          <option value="paypal">PayPal (sim)</option>
          <option value="card">Kreditna kartica (sim)</option>
        </select>
      </div>
      <button disabled={loading} className="bg-green-600 text-white px-3 py-1 rounded">
        {loading ? "Obdelujem..." : "Dodaj sredstva"}
      </button>
    </form>
  );
}
