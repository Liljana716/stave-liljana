// src/utils/seedFirestore.js
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const mockGames = [
  { sport: "Nogomet", teams: { home: "Maribor", away: "Olimpija" }, score: { home: 2, away: 1 }, startTime: new Date().toISOString(), status: "V teku" },
  { sport: "Košarka", teams: { home: "Cedevita Olimpija", away: "Partizan" }, score: { home: 84, away: 80 }, startTime: new Date(new Date().getTime() - 3600*1000).toISOString(), status: "Končano" },
  { sport: "Tenis", teams: { home: "Djoković", away: "Alcaraz" }, score: { home: "6 : 4, 5 : 7, 3 : 2", away: "" }, startTime: new Date().toISOString(), status: "V teku" },
  { sport: "Nogomet", teams: { home: "Manchester City", away: "Real Madrid" }, score: { home: 0, away: 0 }, startTime: new Date(new Date().getTime() + 3600*1000).toISOString(), status: "V teku" },
  { sport: "Košarka", teams: { home: "Barcelona", away: "Real Madrid" }, score: { home: 70, away: 68 }, startTime: new Date().toISOString(), status: "V teku" },
  { sport: "Nogomet", teams: { home: "Liverpool", away: "Chelsea" }, score: { home: 1, away: 3 }, startTime: new Date(new Date().getTime() - 7200*1000).toISOString(), status: "Končano" },
  { sport: "Tenis", teams: { home: "Nadal", away: "Medvedev" }, score: { home: "7 : 6, 6 : 3", away: "" }, startTime: new Date().toISOString(), status: "V teku" },
  { sport: "Nogomet", teams: { home: "Juventus", away: "AC Milan" }, score: { home: 2, away: 2 }, startTime: new Date(new Date().getTime() + 2*3600*1000).toISOString(), status: "V teku" },
  { sport: "Košarka", teams: { home: "Boston Celtics", away: "LA Lakers" }, score: { home: 102, away: 99 }, startTime: new Date(new Date().getTime() - 3600*1000).toISOString(), status: "Končano" },
  { sport: "Nogomet", teams: { home: "PSG", away: "Bayern" }, score: { home: 1, away: 1 }, startTime: new Date().toISOString(), status: "V teku" },
  { sport: "Tenis", teams: { home: "Thiem", away: "Zverev" }, score: { home: "6 : 3, 4 : 6, 2 : 1", away: "" }, startTime: new Date(new Date().getTime() + 3600*1000).toISOString(), status: "V teku" },
  { sport: "Košarka", teams: { home: "Fenerbahce", away: "Anadolu Efes" }, score: { home: 88, away: 91 }, startTime: new Date().toISOString(), status: "V teku" },
  { sport: "Nogomet", teams: { home: "Atletico Madrid", away: "Sevilla" }, score: { home: 3, away: 0 }, startTime: new Date(new Date().getTime() - 10800*1000).toISOString(), status: "Končano" },
  { sport: "Tenis", teams: { home: "Sinner", away: "Ruud" }, score: { home: "6 : 2, 3 : 6, 4 : 1", away: "" }, startTime: new Date().toISOString(), status: "V teku" },
  { sport: "Košarka", teams: { home: "Maccabi Tel Aviv", away: "Olympiacos" }, score: { home: 77, away: 80 }, startTime: new Date(new Date().getTime() + 3600*1000).toISOString(), status: "V teku" },
  { sport: "Nogomet", teams: { home: "Borussia Dortmund", away: "Schalke" }, score: { home: 2, away: 2 }, startTime: new Date().toISOString(), status: "V teku" },
  { sport: "Tenis", teams: { home: "Kyrgios", away: "Auger-Aliassime" }, score: { home: "6 : 4, 6 : 7, 1 : 0", away: "" }, startTime: new Date(new Date().getTime() + 2*3600*1000).toISOString(), status: "V teku" },
  { sport: "Košarka", teams: { home: "Golden State", away: "Brooklyn Nets" }, score: { home: 120, away: 118 }, startTime: new Date(new Date().getTime() - 3600*1000).toISOString(), status: "Končano" },
  { sport: "Nogomet", teams: { home: "Tottenham", away: "Arsenal" }, score: { home: 1, away: 1 }, startTime: new Date(new Date().getTime() + 3*3600*1000).toISOString(), status: "V teku" },
  { sport: "Tenis", teams: { home: "Rublev", away: "Khachanov" }, score: { home: "6 : 3, 6 : 4", away: "" }, startTime: new Date(new Date().getTime() + 7200*1000).toISOString(), status: "V teku" }
];

export const seedFirestore = async () => {
  try {
    for (const game of mockGames) {
      await addDoc(collection(db, "games"), game);
    }
    console.log("✅ Firestore uspešno napolnjen z 20+ igrami!");
  } catch (error) {
    console.error("Napaka pri vstavljanju podatkov:", error);
  }
};
