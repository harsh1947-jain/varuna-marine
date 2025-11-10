import React, { useState } from "react";
import { createPool } from "../api/pool";

export default function PoolingTab() {
  const [shipIds, setShipIds] = useState("S1,S2");
  const [year, setYear] = useState(2025);
  const [message, setMessage] = useState("");

  const handleCreatePool = async () => {
    try {
      const res = await createPool(year, shipIds.split(","));
      setMessage(JSON.stringify(res, null, 2));
    } catch (e) {
      setMessage(e.message);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <h2 className="text-2xl mb-4 text-blue-400">Create Pool</h2>
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Ship IDs (comma separated)"
          value={shipIds}
          onChange={(e) => setShipIds(e.target.value)}
          className="bg-gray-800 p-2 rounded text-white flex-1"
        />
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="bg-gray-800 p-2 rounded text-white w-24"
        />
      </div>
      <button
        onClick={handleCreatePool}
        className="bg-blue-600 px-4 py-2 rounded"
      >
        Create Pool
      </button>
      {message && (
        <pre className="mt-4 bg-gray-800 p-3 rounded text-sm text-gray-300 overflow-x-auto">
          {message}
        </pre>
      )}
    </div>
  );
}
