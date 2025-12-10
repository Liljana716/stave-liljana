// src/utils/seedAdvancedFirestore.js
import { db } from "../firebase";
import {
  collection,
  addDoc,
  setDoc,
  doc,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";

// 🔹 Dummy uporabnik (tvoj ID)
const userId = "WJgkVcYsI8Vs8clCJrFq3Brdu6J3";

export const seedAdvancedFirestore = async () => {
  try {
    console.log("🚀 Začenjam dodajanje dodatnih Firestore podatkov ...");

    // ============================
    // 1️⃣ TEAM STATS – več zgodovinskih podatkov (2023–2025)
    // ============================
    const teams = [
      "Maribor",
      "Olimpija",
      "Real Madrid",
      "Barcelona",
      "Bayern München",
      "Liverpool",
      "PSG",
      "Juventus",
      "Manchester City",
      "Chelsea",
    ];

    const results = ["Zmaga", "Poraz"];
    const today = new Date();

    // Za vsako ekipo dodaj po ~30 tekem (3 leta nazaj)
    for (const team of teams) {
      for (let i = 0; i < 30; i++) {
        const randomOpponent =
          teams[Math.floor(Math.random() * teams.length)];
        if (randomOpponent === team) continue;

        const result = results[Math.floor(Math.random() * results.length)];
        const date = new Date(today);
        date.setDate(today.getDate() - i * 14 - Math.floor(Math.random() * 10)); // naključni zamik dni
        date.setFullYear(today.getFullYear() - Math.floor(Math.random() * 3)); // tudi starejša leta

        // 🔹 Preveri, če obstaja podoben zapis (da ne dvojiš)
        const q = query(
          collection(db, "teamStats"),
          where("team", "==", team),
          where("date", "==", date.toISOString().split("T")[0])
        );
        const existing = await getDocs(q);
        if (existing.empty) {
          await addDoc(collection(db, "teamStats"), {
            team,
            opponent: randomOpponent,
            result,
            date: date.toISOString().split("T")[0],
          });
        }
      }
    }
    console.log("✅ Dodane nove zgodovinske tekme (teamStats)");

    // ============================
    // 2️⃣ NOTIFICATIONS – dopolni obstoječe nastavitve
    // ============================
    const notifSettings = {
      Maribor: true,
      "Real Madrid": true,
      Barcelona: false,
      "Bayern München": true,
      Liverpool: true,
      PSG: false,
      Juventus: true,
      "Manchester City": false,
    };

    // 🔹 Spoji z obstoječim dokumentom
    const notifRef = doc(db, "notifications", userId);
    const notifSnap = await getDocs(collection(db, "notifications"));
    await setDoc(notifRef, notifSettings, { merge: true });
    console.log("✅ Posodobljene nastavitve obvestil (notifications)");

    // ============================
    // 3️⃣ BETS – zgodovinske in sveže stave (za grafe)
    // ============================
    const months = [];
    for (let y = 2023; y <= 2025; y++) {
      for (let m = 1; m <= 12; m++) {
        months.push(`${y}-${String(m).padStart(2, "0")}`);
      }
    }

    for (const month of months) {
      const [year, m] = month.split("-");
      const baseDate = new Date(`${year}-${m}-10`);
      for (let i = 0; i < 6; i++) {
        const randomTeam = teams[Math.floor(Math.random() * teams.length)];
        const opponent = teams[Math.floor(Math.random() * teams.length)];
        if (randomTeam === opponent) continue;

        const result = results[Math.floor(Math.random() * results.length)];
        const amount = Math.floor(Math.random() * 50 + 10);

        // 🔹 doda naključno stavo, če ni podobne
        await addDoc(collection(db, "bets"), {
          userId,
          gameId: `game_${Math.random().toString(36).substring(2, 8)}`,
          teams: `${randomTeam} vs ${opponent}`,
          sport: "Nogomet",
          betType: "Zmaga domačih",
          amount,
          status: result === "Zmaga" ? "Zadeta" : "Zgrešena",
          createdAt: serverTimestamp(),
          month,
        });
      }
    }
    console.log("✅ Dodane dodatne stave (bets)");

    console.log("🎉 Seeding dodatnih podatkov zaključen brez napak!");
  } catch (err) {
    console.error("❌ Napaka pri dodajanju Firestore podatkov:", err);
  }
};
