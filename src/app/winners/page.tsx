"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Winners() {
  const [winners, setWinners] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedWinners = JSON.parse(localStorage.getItem("winners") || "[]");
    setWinners(storedWinners);
  }, []);

  const handleSpinAgain = () => {
    localStorage.removeItem("winners");
    setWinners([]);
    router.push("/spin");
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
        <button
          onClick={handleSpinAgain}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Spin
        </button>
      </div>
    </div>
  );
}
