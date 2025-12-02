// src/components/Help.js
import React from "react";

export default function Help() {
  return (
    <div style={{ padding: "20px" }}>
      <h2>How to Use the App</h2>
      <p>This page explains how the app works.</p>
      <ul>
        <li>Register or login to access your betting dashboard.</li>
        <li>Select matches and place your bets on the board.</li>
        <li>View your bet history in the HISTORY section.</li>
        <li>Add money to your balance in ADD FUNDS.</li>
        <li>Save teams in FAVORITES.</li>
      </ul>
    </div>
  );
}
