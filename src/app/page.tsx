"use client";

import Link from "next/link";
import ExcelUploader from "@/components/ExcelUploader";
import { useState } from "react";

export default function Home() {
  const [names, setNames] = useState<string[]>([]);

  const handleUpload = (uploadedNames: string[]) => {
    setNames(uploadedNames);
    localStorage.setItem("names", JSON.stringify(uploadedNames));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Upload Excel File</h1>
      <ExcelUploader onUpload={handleUpload} />
      {names.length > 0 && (
        <div>
          <p className="mb-2">{names.length} names uploaded successfully!</p>
          <Link
            href="/spin"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Go to Spin Page
          </Link>
        </div>
      )}
    </div>
  );
}
