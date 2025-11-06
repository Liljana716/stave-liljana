import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import PlaceBet from "./PlaceBet";
import Modal from "./Modal";
import FavoriteButton from "./FavoriteButton";

export default function LiveBoard({ filterTeams = [] }) {
  const [games, setGames] = useState([]);
  const [selectedGame, setSelectedGame] = useState(null);
  const { profile } = useAuth();

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "games"), (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGames(data);
    });
    return () => unsub();
  }, []);

  const renderScore = (score) => {
    if (!score) return "-";
    if (typeof score === "string") return score;
    return `${score.home ?? "-"} : ${score.away ?? "-"}`;
  };

  const filteredGames = games.filter(game => {
    if (!filterTeams || filterTeams.length === 0) return true;
    return filterTeams.some(team =>
      game.teams.home.toLowerCase().includes(team.toLowerCase()) ||
      game.teams.away.toLowerCase().includes(team.toLowerCase())
    );
  });

  return (
    <div className="p-6 max-w-6xl mx-auto mt-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Rezultati v živo</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-gray-700 text-center">
          <thead className="bg-gray-200 text-lg">
            <tr>
              <th className="p-3">Šport</th>
              <th className="p-3">Ekipe</th>
              <th className="p-3">Rezultat</th>
              <th className="p-3">Čas</th>
              <th className="p-3">Status</th>
              <th className="p-3">Favorite</th>
              <th className="p-3">Akcija</th>
            </tr>
          </thead>
          <tbody>
            {filteredGames.length === 0 && (
              <tr>
                <td colSpan="7" className="p-4 text-gray-500 italic">Ni tekem za izbrane filtre.</td>
              </tr>
            )}
            {filteredGames.map((game, idx) => {
              const canBet = game.status === "V teku";
              const rowBg = idx % 2 === 0 ? "bg-white" : "bg-gray-50";
              return (
                <tr key={game.id} className={`${rowBg} hover:bg-gray-100`}>
                  <td className="p-4 font-semibold">{game.sport}</td>
                  <td className="p-4 flex flex-col items-center gap-1">
                    <div className="flex items-center gap-2">
                      <span>{game.teams.home}</span>
                      {profile?.uid && <FavoriteButton teamName={game.teams.home} />}
                    </div>
                    <div className="flex items-center gap-2">
                      <span>{game.teams.away}</span>
                      {profile?.uid && <FavoriteButton teamName={game.teams.away} />}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-lg">{renderScore(game.score)}</td>
                  <td className="p-4">{game.startTime ? new Date(game.startTime).toLocaleString() : "-"}</td>
                  <td className={`p-4 font-semibold ${canBet ? "text-green-600" : "text-gray-500"}`}>{game.status}</td>
                  <td className="p-4">
                    {/* Prikaz zvezdic je zdaj direktno ob ekipah */}
                  </td>
                  <td className="p-4">
                    <button
                      disabled={!canBet}
                      onClick={() => canBet && setSelectedGame(game)}
                      className={`px-4 py-2 rounded font-semibold transition w-full ${
                        canBet
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      Oddaj stavo
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedGame && (
        <Modal onClose={() => setSelectedGame(null)}>
          <PlaceBet game={selectedGame} onClose={() => setSelectedGame(null)} />
        </Modal>
      )}
    </div>
  );
}
