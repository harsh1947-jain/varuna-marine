import React, { useEffect, useState } from "react";
import { fetchComparison } from "../api/routes";

export default function CompareTab() {
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComparison(2025)
      .then((res) => setData(res))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-400">Loading comparison data...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-lg space-y-6">
      <h2 className="text-2xl font-semibold text-purple-400">Route Comparison (2025)</h2>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-800">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-gray-800 text-gray-200 uppercase text-xs">
            <tr>
              <th className="p-3">Route ID</th>
              <th className="p-3">Vessel Type</th>
              <th className="p-3">Fuel Type</th>
              <th className="p-3">GHG Intensity</th>
              <th className="p-3">% Difference</th>
              <th className="p-3">Compliant</th>
            </tr>
          </thead>
          <tbody>
            {data.map((r) => (
              <tr
                key={r.id}
                className={`border-b border-gray-800 hover:bg-gray-800/50 transition ${
                  r.is_baseline ? "bg-blue-900/40" : ""
                }`}
              >
                <td className="p-3 font-medium">{r.route_id}</td>
                <td className="p-3">{r.vessel_type}</td>
                <td className="p-3">{r.fuel_type}</td>
                <td className="p-3">{r.ghg_intensity.toFixed(2)}</td>
                <td
                  className={`p-3 font-semibold ${
                    r.percentDiff > 0 ? "text-red-400" : "text-green-400"
                  }`}
                >
                  {r.percentDiff.toFixed(2)}%
                </td>
                <td className="p-3 text-lg">
                  {r.isCompliant ? "✅" : "❌"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simple Bar Chart */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h3 className="text-gray-300 text-sm mb-3">GHG Intensity Comparison</h3>
        <div className="flex items-end gap-3 h-56">
          {data.map((r) => {
            const height = (r.ghg_intensity / Math.max(...data.map(d => d.ghg_intensity))) * 200;
            return (
              <div key={r.id} className="flex flex-col items-center flex-1">
                <div
                  className={`w-8 rounded-t-md ${
                    r.is_baseline
                      ? "bg-blue-500"
                      : r.isCompliant
                      ? "bg-green-400"
                      : "bg-red-400"
                  }`}
                  style={{ height: `${height}px` }}
                  title={`${r.ghg_intensity} gCO₂e/MJ`}
                ></div>
                <span className="text-xs mt-2 truncate">{r.route_id}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
