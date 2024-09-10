import React, { useState } from "react";
import Papa from "papaparse";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import "./CsvUpload.css"; // Link to the updated CSS file

const CsvUploader = () => {
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setError("Please upload a valid CSV file.");
      return;
    }
    Papa.parse(file, {
      complete: (result) => {
        setCsvData(result.data);
        setError(null);
      },
      header: true,
      skipEmptyLines: true,
    });
  };

  const saveToDatabase = async () => {
    if (csvData.length === 0) {
      setError("No data to save. Please upload a CSV file first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      for (const row of csvData) {
        if (!row.loc || !row.cases || !row.deaths || !row.date || !row.Region || !row.year) {
          console.warn("Skipping row due to missing fields:", row);
          continue;
        }

        await addDoc(collection(db, "dengueData"), {
          location: row.loc,
          cases: Number(row.cases),
          deaths: Number(row.deaths),
          date: row.date,
          regions: row.Region,
          year: row.year,
        });
      }
      setLoading(false);
      alert("Data saved to database successfully!");
    } catch (error) {
      setLoading(false);
      setError("Error saving data: " + error.message);
    }
  };

  return (
    <div className="csv-upload-container">
      <h2>Upload CSV File</h2>
      <label className="file-input-label">
        <input type="file" accept=".csv" onChange={handleFileUpload} className="file-input" />
        Choose File
      </label>

      {csvData.length > 0 && (
        <button onClick={saveToDatabase} disabled={loading} className="upload-button">
          {loading ? "Saving Data..." : "Save to Database"}
        </button>
      )}

      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default CsvUploader;
