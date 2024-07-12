"use client";

import { useState, useEffect } from "react";
import { Wheel } from "react-custom-roulette";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Spin() {
  const [names, setNames] = useState<string[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [selectCount, setSelectCount] = useState(100);
  const router = useRouter();

  useEffect(() => {
    const storedNames = JSON.parse(localStorage.getItem("names") || "[]");
    setNames(storedNames);
  }, []);

  const handleSpinClick = () => {
    if (!mustSpin && names.length > 0) {
      const newPrizeNumber = Math.floor(Math.random() * names.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const handleSpinStop = () => {
    setMustSpin(false);
    const newSelectedNames: string[] = [];
    const remainingNames = [...names];

    while (newSelectedNames.length < selectCount && remainingNames.length > 0) {
      const randomIndex = Math.floor(Math.random() * remainingNames.length);
      newSelectedNames.push(remainingNames[randomIndex]);
      remainingNames.splice(randomIndex, 1);
    }

    setSelectedNames(newSelectedNames);
    setNames(remainingNames);
    localStorage.setItem("names", JSON.stringify(remainingNames));

    // Save winners
    const currentWinners = JSON.parse(localStorage.getItem("winners") || "[]");
    const updatedWinners = [...currentWinners, ...newSelectedNames];
    localStorage.setItem("winners", JSON.stringify(updatedWinners));

    // Navigate to winners page
    router.push("/winners");
  };

  const wheelData = names.map((name) => ({ option: name }));

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Random Name Spinner</h1>
      <div className="mb-4">
        <label htmlFor="selectCount" className="block mb-2">
          Number of names to select:
        </label>
        <input
          type="number"
          id="selectCount"
          value={selectCount}
          onChange={(e) =>
            setSelectCount(
              Math.min(Math.max(1, parseInt(e.target.value)), names.length)
            )
          }
          className="border rounded px-2 py-1"
        />
      </div>
      <div className="flex justify-center mb-4">
        <Wheel
          mustStartSpinning={mustSpin}
          prizeNumber={prizeNumber}
          data={wheelData.length > 0 ? wheelData : [{ option: "No names" }]}
          onStopSpinning={handleSpinStop}
          backgroundColors={["#ff8f43", "#70bbe0", "#0b3351", "#f9dd50"]}
          textColors={["#ffffff"]}
          outerBorderColor="#eeeeee"
          outerBorderWidth={10}
          innerRadius={0}
          radiusLineColor="#eeeeee"
          radiusLineWidth={1}
          fontSize={10}
          perpendicularText={true}
        />
      </div>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        onClick={handleSpinClick}
        disabled={mustSpin || names.length === 0}
      >
        SPIN
      </button>
      <Link
        href="/"
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
      >
        Back to Upload
      </Link>
      <div className="mt-4">
        <h2 className="text-2xl font-bold mb-2">
          Selected Names ({selectedNames.length}):
        </h2>
        <ul className="list-disc list-inside">
          {selectedNames.map((name, index) => (
            <li key={index}>{name}</li>
          ))}
        </ul>
      </div>
      <div className="mt-4">
        <h2 className="text-2xl font-bold mb-2">
          Remaining Names: {names.length}
        </h2>
      </div>
    </div>
  );
}
