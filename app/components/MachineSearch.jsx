"use client";
import { useState } from "react";

export default function MachineSearch({ onAdd }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  async function handleSearch(e) {
    const value = e.target.value;
    setQuery(value);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    try {
      const res = await fetch(`/api/machines?model=${value}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setResults([]);
    }
  }

  return (
    <div>
      <input
        value={query}
        onChange={handleSearch}
        placeholder="Enter model number"
        className="border-2 p-2 w-full rounded-lg"
      />

      {results.length > 0 && (
        <ul className="bg-white text-black border mt-2 max-h-64 overflow-y-auto shadow-lg rounded-md">
          {results.map(machine => (
            <li
              key={machine.model_number}
              className="p-2 flex justify-between border-b border-gray-300"
            >
              <span>
                {machine.model_number} – {machine.name}
              </span>

              <button
                onClick={() =>
                  onAdd({
                    ...machine,
                    qty: 1,
                    margin: 0, // ✅ default margin
                  })
                }
                className="text-blue-600 font-medium"
              >
                Add +
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
