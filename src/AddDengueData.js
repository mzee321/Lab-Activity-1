import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";
import './AddDengueData.css'; // For modal styling

const AddDengueData = () => {
  const [location, setLocation] = useState("");
  const [cases, setCases] = useState("");
  const [deaths, setDeaths] = useState("");
  const [date, setDate] = useState("");
  const [regions, setRegions] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const validateDate = (dateStr) => {
    const datePattern = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/; // MM/DD/YYYY pattern
    return datePattern.test(dateStr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateDate(date)) {
      alert("Please enter a valid date in MM/DD/YYYY format.");
      return;
    }

    try {
      await addDoc(collection(db, "dengueData"), {
        location,
        cases: Number(cases),
        deaths: Number(deaths),
        date, // The date will be stored as MM/DD/YYYY
        regions,
      });
      setLocation("");
      setCases("");
      setDeaths("");
      setDate("");
      setRegions("");
      setIsModalOpen(false); // Close modal on successful submission
      alert("Data added successfully!");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div>
      <button className="add-data-button" onClick={() => setIsModalOpen(true)}>Add Data</button> {/* Button to open modal */}

      {isModalOpen && (
        <div className="modal"> {/* Modal */}
          <div className="modal-content">
            <span className="close" onClick={() => setIsModalOpen(false)}>&times;</span> {/* Close button */}
            <h2>Add Dengue Data</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Cases"
                value={cases}
                onChange={(e) => setCases(e.target.value)}
                required
              />
              <input
                type="number"
                placeholder="Deaths"
                value={deaths}
                onChange={(e) => setDeaths(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Date (MM/DD/YYYY)"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Regions"
                value={regions}
                onChange={(e) => setRegions(e.target.value)}
                required
              />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddDengueData;
