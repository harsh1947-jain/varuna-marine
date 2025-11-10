import React, { useState } from "react";
import { bankSurplus, applyBanked } from "../api/banking";

export default function BankingTab() {
  const [shipId, setShipId] = useState("S1");
  const [year, setYear] = useState(2025);
  const [amount, setAmount] = useState(50);
  const [message, setMessage] = useState("");

  const handleBank = async () => {
    try {
      const res = await bankSurplus(shipId, year, amount);
      setMessage(res.message);
    } catch (e) {
      setMessage(e.message);
    }
  };

  const handleApply = async () => {
    try {
      const res = await applyBanked(shipId, year, amount);
      setMessage(res.message);
    } catch (e) {
      setMessage(e.message);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <h2 className="text-2xl mb-4 text-green-400">Banking Actions</h2>
      <div className="flex gap-4 mb-4">
        <input
          value={shipId}
          onChange={(e) => setShipId(e.target.value)}
          placeholder="Ship ID"
          className="bg-gray-800 p-2 rounded text-white"
        />
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="bg-gray-800 p-2 rounded text-white w-24"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="bg-gray-800 p-2 rounded text-white w-24"
        />
      </div>
      <div className="flex gap-4">
        <button onClick={handleBank} className="bg-blue-600 px-4 py-2 rounded">
          Bank Surplus
        </button>
        <button onClick={handleApply} className="bg-teal-600 px-4 py-2 rounded">
          Apply Surplus
        </button>
      </div>
      {message && <p className="mt-4 text-gray-300">{message}</p>}
    </div>
  );
}
