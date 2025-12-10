import React, { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      setError("");
      setMessage("Prijava uspešna!");
      navigate("/board"); // ✅ preusmeritev po prijavi
    } catch (err) {
      setError("Napačni podatki. Poskusi znova.");
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Vnesi e-pošto za ponastavitev gesla.");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("E-pošta za ponastavitev gesla je bila poslana.");
      setError("");
    } catch (err) {
      setError("Napaka pri pošiljanju e-pošte.");
    }
  };

  return (
<form onSubmit={handleLogin} className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-10 border border-gray-200">
  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">LOGIN</h2>
  <input
    type="email"
    placeholder="Username"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    className="border border-gray-300 rounded px-3 py-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
  />
  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    className="border border-gray-300 rounded px-3 py-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-green-500"
  />
  <div className="text-right mb-2">
    <button type="button" onClick={handleForgotPassword} className="text-sm text-blue-600 underline hover:text-blue-800">
      Forgotten password?
    </button>
  </div>
  <button type="submit" className="bg-gray-800 hover:bg-gray-900 text-white font-semibold py-2 rounded w-full">
    Login
  </button>
  {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
  {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
</form>

  );
};

export default Login;
