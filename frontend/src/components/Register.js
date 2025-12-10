// src/components/Register.js
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password.length < 8 || !/\d/.test(password)) {
      setError("Geslo mora imeti vsaj 8 znakov in vsebovati številko.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await sendEmailVerification(userCredential.user);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        username,
        email,
        createdAt: new Date().toISOString(),
      });

      setMessage("Registracija uspešna! Preveri e-pošto za potrditev računa.");
      setError("");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
<form onSubmit={handleRegister} className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto mt-10 border border-gray-200">
  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">REGISTER</h2>
  <input
    type="text"
    placeholder="Username"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    required
    className="border border-gray-300 rounded px-3 py-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <input
    type="email"
    placeholder="E-mail"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    className="border border-gray-300 rounded px-3 py-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <input
    type="password"
    placeholder="Password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    className="border border-gray-300 rounded px-3 py-2 mb-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded w-full">
    Register
  </button>
  {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
  {message && <p className="text-green-600 text-sm mt-2">{message}</p>}
</form>

  );
};

export default Register;
