import React, { useEffect, useState } from "react";
import { fetchRoutes, setBaseline } from "../api/routes";

export default function RoutesTab() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBaseline, setSelectedBaseline] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch all routes from backend
  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      const res = await fetchRoutes(2025);
      setRoutes(res);
      const base = res.find((r) => r.is_baseline);
      setSelectedBaseline(base ? base.id : null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetBaseline = async (id) => {
    try {
      await setBaseline(id);
      setMessage(`✅ Baseline set to route ID ${id}`);
      await loadRoutes(); // Refresh list
    } catch (err) {
      setMessage(`❌ ${err.message}`);
    }
  };

  if (loading) return <p className="text-gray-400">Loading routes...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-blue-400">Routes Overview (2025)</h2>
        {message && <p className="text-sm text-gray-300">{message}</p>}
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-800 text-gray-200 uppercase text-xs">
            <tr>
              <th className="p-3">Route ID</th>
              <th className="p-3">Vessel Type</th>
              <th className="p-3">Fuel Type</th>
              <th className="p-3 text-center">GHG Intensity</th>
              <th className="p-3 text-center">Distance (km)</th>
              <th className="p-3 text-center">Fuel Used (t)</th>
              <th className="p-3 text-center">Emissions (t)</th>
              <th className="p-3 text-center">Baseline</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r) => (
              <tr
                key={r.id}
                className={`border-b border-gray-800 hover:bg-gray-800/40 transition ${
                  r.is_baseline ? "bg-blue-900/30" : ""
                }`}
              >
                <td className="p-3 font-medium">{r.route_id}</td>
                <td className="p-3">{r.vessel_type}</td>
                <td className="p-3">{r.fuel_type}</td>
                <td className="p-3 text-center font-semibold">{r.ghg_intensity}</td>
                <td className="p-3 text-center">{r.distance_km.toLocaleString()}</td>
                <td className="p-3 text-center">{r.fuel_consumption_t.toLocaleString()}</td>
                <td className="p-3 text-center">{r.total_emissions_t.toLocaleString()}</td>
                <td className="p-3 text-center">
                  {r.is_baseline ? (
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                      Baseline
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSetBaseline(r.id)}
                      className="bg-gray-700 text-xs px-3 py-1 rounded hover:bg-blue-700"
                    >
                      Set
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Section */}
      <div className="bg-gray-800 p-4 rounded-lg flex flex-wrap justify-around gap-6 text-center">
        <div>
          <p className="text-sm text-gray-400">Total Routes</p>
          <p className="text-xl font-bold text-white">{routes.length}</p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Baseline Route</p>
          <p className="text-xl font-bold text-blue-400">
            {routes.find((r) => r.is_baseline)?.route_id || "None"}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-400">Avg GHG Intensity</p>
          <p className="text-xl font-bold text-green-400">
            {(
              routes.reduce((acc, r) => acc + r.ghg_intensity, 0) / routes.length
            ).toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}
