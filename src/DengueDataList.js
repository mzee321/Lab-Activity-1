import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import './DengueDataList.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DengueDataList = ({ dataUpdated }) => {
  const [dengueData, setDengueData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    location: "",
    cases: "",
    deaths: "",
    date: "",
    regions: "",
  });
  const [sortConfig, setSortConfig] = useState({ key: "location", direction: "ascending" });
  const [filter, setFilter] = useState("");

  const fetchData = async () => {
    try {
      const dengueCollection = collection(db, "dengueData");
      const dengueSnapshot = await getDocs(dengueCollection);
      const dataList = dengueSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDengueData(dataList);
      console.log("Fetched dengue data: ", dataList);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dataUpdated]);

  const handleDelete = async (id) => {
    const dengueDocRef = doc(db, "dengueData", id);
    try {
      await deleteDoc(dengueDocRef);
      setDengueData(dengueData.filter((data) => data.id !== id));
      alert("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (data) => {
    setEditingId(data.id);
    setEditForm({
      location: data.location || "",
      cases: data.cases || "",
      deaths: data.deaths || "",
      date: data.date || "",
      regions: data.regions || "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const dengueDocRef = doc(db, "dengueData", editingId);
    try {
      await updateDoc(dengueDocRef, {
        location: editForm.location,
        cases: Number(editForm.cases),
        deaths: Number(editForm.deaths),
        date: editForm.date,
        regions: editForm.regions,
      });
      setDengueData(dengueData.map((data) =>
        data.id === editingId ? { id: editingId, ...editForm } : data
      ));
      setEditingId(null);
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const sortData = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = dengueData.sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "ascending" ? 1 : -1;
    }
    return 0;
  });

  const filteredData = sortedData.filter((data) => {
    const location = data.location ? data.location.toLowerCase() : "";
    const date = data.date ? data.date : "";
    const regions = data.regions ? data.regions.toLowerCase() : "";
    const filterLower = filter.toLowerCase();

    return (
      location.includes(filterLower) ||
      date.includes(filter) ||
      regions.includes(filterLower)
    );
  });

  // Prepare data for the bar chart
  const regionCounts = filteredData.reduce((acc, data) => {
    acc[data.regions] = (acc[data.regions] || 0) + 1;
    return acc;
  }, {});

  const chartData = {
    labels: Object.keys(regionCounts),
    datasets: [
      {
        label: 'Number of Entries by Region',
        data: Object.values(regionCounts),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="container">
      <h2>Dengue Data List</h2>

      <div className="filter-container">
        <input
          type="text"
          placeholder="Filter by location, date, or region"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
      </div>

      {editingId ? (
        <form onSubmit={handleUpdate} className="edit-form">
          <input
            type="text"
            placeholder="Location"
            value={editForm.location}
            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Cases"
            value={editForm.cases}
            onChange={(e) => setEditForm({ ...editForm, cases: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Deaths"
            value={editForm.deaths}
            onChange={(e) => setEditForm({ ...editForm, deaths: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Date"
            value={editForm.date}
            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Regions"
            value={editForm.regions}
            onChange={(e) => setEditForm({ ...editForm, regions: e.target.value })}
            required
          />
          <button type="submit">Update Data</button>
          <button type="button" onClick={() => setEditingId(null)}>Cancel</button>
        </form>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th onClick={() => sortData("location")}>Location</th>
                <th onClick={() => sortData("cases")}>Cases</th>
                <th onClick={() => sortData("deaths")}>Deaths</th>
                <th onClick={() => sortData("date")}>Date</th>
                <th onClick={() => sortData("regions")}>Regions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((data) => (
                <tr key={data.id}>
                  <td>{data.location}</td>
                  <td>{data.cases}</td>
                  <td>{data.deaths}</td>
                  <td>{data.date}</td>
                  <td>{data.regions}</td>
                  <td>
                    <button onClick={() => handleEdit(data)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(data.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="chart-container">
            <h3></h3>            
            <h3>Number of Entries by Region</h3>
            <Bar data={chartData} options={chartOptions} />
          </div>
        </>
      )}
    </div>
  );
};

export default DengueDataList;
