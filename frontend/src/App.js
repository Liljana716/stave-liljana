// src/App.js
import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import LiveBoard from "./components/LiveBoard";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import './styles.css';
//import PlaceBet from "./components/PlaceBet";
import BetHistory from "./components/BetHistory";
import AddFunds from "./components/AddFunds";
import FavoritesList from "./components/FavoritesList";
import "./styles.css";
import TeamStats from './components/TeamStats';
import Notifications from './components/Notifications';
import UserStats from './components/UserStats';
import Help from "./components/Help";  

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // ✅ preusmeri le, če si na login ali register strani
        if (location.pathname === "/" || location.pathname === "/register") {
          navigate("/board");
        }
      } else {
        // ✅ če nisi prijavljen, preusmeri na login
        if (location.pathname !== "/" && location.pathname !== "/register" && location.pathname !== "/help") 
        {
          navigate("/");
        }
      }
    });

    return () => unsubscribe();
  }, [navigate, location]);
  return (
    <div>
      {/* 🔹 Navbar */}
      <nav className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex gap-6" >
          
          <Link to="/help" className="hover:text-purple-400 font-semibold">
            HELP
          </Link>
          <Link to="/" className="hover:text-green-400 font-semibold">
            HOME
          </Link>
          <Link to="/board" className="hover:text-yellow-400 font-semibold">
            BETTING
          </Link>
          <Link to="/bets" className="hover:text-blue-400 font-semibold">
            HISTORY
          </Link>
          <Link to="/favorites" className="hover:text-pink-400 font-semibold">
            FAVORITES
          </Link>
          <Link to="/add-funds" className="hover:text-green-400 font-semibold">
            ADD FUNDS
          </Link>
          <Link to="/team-stats" className="hover:text-indigo-400 font-semibold">STATS</Link>
          <Link to="/notifications" className="hover:text-orange-400 font-semibold">NOTIF</Link>
          <Link to="/user-stats" className="hover:text-teal-400 font-semibold">MY STATS</Link>

        </div>
        <div className="flex items-center gap-2">
          <span className="material-icons">account_circle</span>
          <span className="font-semibold">USER</span>
        </div>
      </nav>

      {/* 🔹 Routes */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/board" element={<LiveBoard />} />
        <Route path="/bets" element={<BetHistory />} />
        <Route path="/add-funds" element={<AddFunds />} />
        <Route path="/favorites" element={<FavoritesList />} />
        <Route path="/team-stats" element={<TeamStats teamName="Maribor" />} />
        <Route path="/notifications" element={<Notifications favorites={["Maribor", "Real Madrid"]} />} />
        <Route path="/user-stats" element={<UserStats />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </div>
  );
}

// ✅ Ovijemo z Router in exportamo
export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
