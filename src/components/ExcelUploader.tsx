import { useState } from "react";
import * as XLSX from "xlsx";

interface ExcelUploaderProps {
  onUpload: (names: string[]) => void;
}

export default function ExcelUploader({ onUpload }: ExcelUploaderProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {
      const bstr = event.target?.result;
      if (typeof bstr !== "string") {
        setUploading(false);
        return;
      }

      try {
        const workbook = XLSX.read(bstr, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

        // Filter out empty rows and cells, and ensure we're only getting strings
        const names = data
          .flat()
          .filter(
            (cell): cell is string =>
              typeof cell === "string" && cell.trim() !== ""
          );

        onUpload(names);
      } catch (error) {
        console.error("Error parsing Excel file:", error);
        // You might want to show an error message to the user here
      } finally {
        setUploading(false);
      }
    };

    reader.readAsBinaryString(file);
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
        disabled={uploading}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100"
      />
      {uploading && <p>Uploading...</p>}
    </div>
  );
}
