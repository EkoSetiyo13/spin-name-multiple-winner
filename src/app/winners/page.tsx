"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function Winners() {
  const [winners, setWinners] = useState<string[]>([]);

  useEffect(() => {
    const storedWinners = JSON.parse(localStorage.getItem("winners") || "[]");
    setWinners(storedWinners);
  }, []);

  const handleReset = () => {
    localStorage.removeItem("winners");
    localStorage.removeItem("names");
    setWinners([]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Winners</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {winners.map((winner, index) => (
          <div
            key={index}
            className="bg-white shadow rounded-lg p-4 text-center"
          >
            <p className="font-semibold">{winner}</p>
          </div>
        ))}
      </div>
      <div className="flex space-x-4">
        <Link
          href="/spin"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Spin
        </Link>
        <button
          onClick={handleReset}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Reset All
        </button>
      </div>
    </div>
  );
}
