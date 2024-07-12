"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Definisikan tipe untuk props Wheel
interface WheelProps {
  mustStartSpinning: boolean;
  prizeNumber: number;
  data: { option: string }[];
  onStopSpinning: () => void;
  backgroundColors: string[];
  textColors: string[];
  outerBorderColor: string;
  outerBorderWidth: number;
  innerRadius: number;
  radiusLineColor: string;
  radiusLineWidth: number;
  fontSize: number;
  perpendicularText: boolean;
}

const Wheel = dynamic<WheelProps>(
  () => import("react-custom-roulette").then((mod) => mod.Wheel),
  { ssr: false }
);

export default function Spin() {
  const [names, setNames] = useState<string[]>([]);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [selectCount, setSelectCount] = useState(0);
  const [winnerPrize, setWinnerPrize] = useState("");
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const storedNames = JSON.parse(localStorage.getItem("names") || "[]");
    setNames(storedNames);
  }, []);

  const handleSpinClick = () => {
    if (!mustSpin && names.length > 0) {
      const newPrizeNumber = Math.floor(Math.random() * names.length);
      console.log(newPrizeNumber);
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
    localStorage.setItem("winnerPrize", winnerPrize);

    // Navigate to winners page
    router.push("/winners");
  };

  const wheelData = names.map((name) => ({ option: name }));

  if (!isClient) {
    return <div>Loading...</div>; // or any loading indicator
  }

  const handleReset = () => {
    localStorage.removeItem("names");
    router.push("/");
  };

  return (
    <div>
      <div className="container mx-auto p-4">
        <h1 className="text-3xl text-center font-bold mb-4">
          Random Name Spinner
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
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
                      Math.min(
                        Math.max(1, parseInt(e.target.value)),
                        names.length
                      )
                    )
                  }
                  className="border rounded px-2 py-1"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="winnerPrize" className="block mb-2">
                  Winner Prize
                </label>
                <input
                  id="winnerPrize"
                  type="text"
                  value={winnerPrize}
                  onChange={(e) => setWinnerPrize(e.target.value)}
                  className="border rounded px-2 py-1"
                />
              </div>
            </div>
            <div>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handleSpinClick}
                disabled={mustSpin || names.length === 0}
              >
                SPIN
              </button>
              <button
                onClick={handleReset}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Reset
              </button>
              <div className="mt-4">
                <h2 className="text-2xl font-bold mb-2">
                  Remaining Names: {names.length}
                </h2>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className={wheelData.length < 100 ? "block" : "hidden"}>
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={
                  wheelData.length > 0 ? wheelData : [{ option: "No names" }]
                }
                onStopSpinning={handleSpinStop}
                backgroundColors={["#ff8f43", "#70bbe0", "#0b3351", "#f9dd50"]}
                textColors={["#ffffff"]}
                outerBorderColor="#eeeeee"
                outerBorderWidth={10}
                innerRadius={0}
                radiusLineColor="#eeeeee"
                radiusLineWidth={1}
                fontSize={12}
                perpendicularText={false}
              />
            </div>
          </div>
        </div>
      </div>
      {wheelData.length > 100 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4">
            <div style={{ width: "100px", height: "100px" }}>
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={0}
                data={
                  wheelData.length > 0
                    ? wheelData.slice(0, 100)
                    : [{ option: "No names" }]
                }
                onStopSpinning={() => {}}
                backgroundColors={["#ff8f43", "#70bbe0", "#0b3351", "#f9dd50"]}
                textColors={["#ffffff"]}
                outerBorderColor="#eeeeee"
                outerBorderWidth={10}
                innerRadius={0}
                radiusLineColor="#eeeeee"
                radiusLineWidth={1}
                fontSize={12}
                perpendicularText={false}
              />
            </div>
          </div>
          <div className="p-4">
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={0}
              data={
                wheelData.length > 0
                  ? wheelData.slice(101, 200)
                  : [{ option: "No names" }]
              }
              onStopSpinning={() => {}}
              backgroundColors={["#ff8f43", "#70bbe0", "#0b3351", "#f9dd50"]}
              textColors={["#ffffff"]}
              outerBorderColor="#eeeeee"
              outerBorderWidth={10}
              innerRadius={0}
              radiusLineColor="#eeeeee"
              radiusLineWidth={1}
              fontSize={15}
              perpendicularText={false}
            />
          </div>
          <div className="p-4">
            <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={0}
              data={
                wheelData.length > 0
                  ? wheelData.slice(200, 301)
                  : [{ option: "No names" }]
              }
              onStopSpinning={() => {}}
              backgroundColors={["#ff8f43", "#70bbe0", "#0b3351", "#f9dd50"]}
              textColors={["#ffffff"]}
              outerBorderColor="#eeeeee"
              outerBorderWidth={10}
              innerRadius={0}
              radiusLineColor="#eeeeee"
              radiusLineWidth={1}
              fontSize={15}
              perpendicularText={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
