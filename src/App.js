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
        if (location.pathname !== "/" && location.pathname !== "/register") {
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
        <div className="flex gap-6">
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
