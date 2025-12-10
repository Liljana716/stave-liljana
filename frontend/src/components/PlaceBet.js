import React, { useState } from "react";
import { db, auth } from "../firebase";
import { collection, doc, addDoc, runTransaction, serverTimestamp } from "firebase/firestore";

const PlaceBet = ({ game, onClose }) => {
  const [amount, setAmount] = useState("");
  const [betType, setBetType] = useState("Zmaga domačih");
  const [loading, setLoading] = useState(false);

  // Dodamo kvote (lahko se kasneje naloži iz DB)
  const odds = {
    "Zmaga domačih": game.odds?.homeWin || 1.5,
    Remi: game.odds?.draw || 2.0,
    "Zmaga gostov": game.odds?.awayWin || 2.5,
  };

  const handleBet = async () => {
    const parsedAmount = Number(amount);
    if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Vnesi veljaven znesek!");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      alert("Za oddajo stave se moraš prijaviti.");
      return;
    }

    setLoading(true);

    try {
      const userRef = doc(db, "users", user.uid);

      await runTransaction(db, async (tx) => {
        const snap = await tx.get(userRef);
        if (!snap.exists()) throw new Error("Uporabnik ne obstaja.");

        const balance = snap.data().balance || 0;
        if (balance < parsedAmount) throw new Error("Ni dovolj sredstev za stavo. Prosimo napolnite račun!");

        tx.update(userRef, { balance: balance - parsedAmount });

        const betsRef = collection(db, "bets");
        await addDoc(betsRef, {
          userId: user.uid,
          gameId: game.id,
          teams: game.teams,
          sport: game.sport,
          betType,
          amount: parsedAmount,
          odds: odds[betType],
          possibleWin: parsedAmount * odds[betType],
          status: "Oddano",
          createdAt: serverTimestamp(),
        });
      });

      alert("Stava je bila uspešno oddana!");
      setAmount("");
      onClose();
    } catch (err) {
      console.error("Napaka pri oddaji stave:", err);
      alert(err.message || "Napaka pri oddaji stave.");
    }

    setLoading(false);
  };

  const renderTeams = (teams) => {
    if (!teams) return "-";
    return `${teams.home} vs ${teams.away}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Oddaj stavo</h2>

        <p className="mb-2 font-semibold">{renderTeams(game.teams)}</p>
        <p className="text-gray-600 mb-4">{game.sport}</p>

        <label className="block mb-2 font-semibold">Vrsta stave:</label>
        <select
          value={betType}
          onChange={(e) => setBetType(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-2"
        >
          <option>Zmaga domačih</option>
          <option>Remi</option>
          <option>Zmaga gostov</option>
        </select>

        {/* Prikaz kvote za izbrano vrsto stave */}
        <p className="mb-4 text-gray-700">
          Kvota: <span className="font-semibold">{odds[betType]}</span>
        </p>

        <label className="block mb-2 font-semibold">Znesek (€):</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-2"
          placeholder="Vnesi znesek"
        />

        {/* Prikaz možnega dobitka */}
        {amount && !isNaN(Number(amount)) && Number(amount) > 0 && (
          <p className="mb-4 text-green-700 font-semibold">
            Možni dobitek: €{(Number(amount) * odds[betType]).toFixed(2)}
          </p>
        )}

        {/* Primerjava kvot */}
        <div className="mb-4 text-sm text-gray-600">
          <p className="font-semibold">Primerjava kvot:</p>
          <ul>
            <li>Zmaga domačih: {odds["Zmaga domačih"]}</li>
            <li>Remi: {odds["Remi"]}</li>
            <li>Zmaga gostov: {odds["Zmaga gostov"]}</li>
          </ul>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Prekliči
          </button>
          <button
            onClick={handleBet}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            {loading ? "Shranjujem..." : "Potrdi stavo"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceBet;
