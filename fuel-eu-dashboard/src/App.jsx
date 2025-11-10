import React, { useState } from "react";
import RoutesTab from "./components/RouteTab";
import CompareTab from "./components/CompareTab";
import BankingTab from "./components/BankingTab";
import PoolingTab from "./components/PoolingTab";

export default function App() {
  const [tab, setTab] = useState("routes");

  const renderTab = () => {
    switch (tab) {
      case "routes": return <RoutesTab />;
      case "compare": return <CompareTab />;
      case "banking": return <BankingTab />;
      case "pooling": return <PoolingTab />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen w-screen p-6 bg-gradient-to-b from-[#0B0F1A] to-[#111827]">
      <header className="max-w-5xl mx-auto mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">⚡ Fuel EU Dashboard</h1>
        <p className="text-sm text-gray-400">React + JS + Tailwind</p>
      </header>

      <nav className="flex gap-2 justify-center mb-10 flex-wrap">
        {["routes", "compare", "banking", "pooling"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-lg transition ${
              tab === t
                ? "bg-accent text-white"
                : "bg-gray-800 text-gray-400 hover:bg-gray-700"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </nav>

      <main className="max-w-5xl mx-auto">{renderTab()}</main>
    </div>
  );
}
