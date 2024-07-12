"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useWindowSize } from "react-use";

const ConfettiExplosion = dynamic(
  () => import("react-confetti-explosion").then((mod) => mod.default),
  { ssr: false }
);

const Confetti = dynamic(
  () => import("react-confetti").then((mod) => mod.default),
  { ssr: false }
);

export default function Winners() {
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  const { width, height } = useWindowSize();

  const [isConfettiActive, setIsConfettiActive] = useState(true);
  const [winners, setWinners] = useState<string[]>([]);
  const [winnerPrize, setWinnerPrize] = useState("");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const storedWinners = JSON.parse(localStorage.getItem("winners") || "[]");
    setWinners(storedWinners);
    const storedWinnerPrize = localStorage.getItem("winnerPrize") || "";
    setWinnerPrize(storedWinnerPrize);
  }, []);

  const handleSpinAgain = () => {
    localStorage.removeItem("winners");
    setWinners([]);
    router.push("/spin");
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isConfettiActive) {
      timer = setTimeout(() => {
        setIsConfettiActive(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [isConfettiActive, router]);

  if (!isClient) {
    return <div>Loading...</div>; // or any loading indicator
  }

  return (
    <div className="container mx-auto p-4">
      {isClient && isConfettiActive && (
        <Confetti
          width={width}
          height={height}
          recycle={true}
          numberOfPieces={300}
          gravity={0.3}
          run={isConfettiActive}
        />
      )}
      <h1 className="text-3xl text-center font-bold mb-4">
        {winners.length} Pemenang {winnerPrize}
      </h1>
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
