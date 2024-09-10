// TimelineChart.js
import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const TimelineChart = () => {
  const [dengueData, setDengueData] = useState([]);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      const dengueCollection = collection(db, "dengueData");
      const dengueSnapshot = await getDocs(dengueCollection);
      const dataList = dengueSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDengueData(dataList);
    };

    fetchData();
  }, []);

  // Extract unique years from the data
  const years = Array.from(new Set(dengueData.map((data) => new Date(data.date).getFullYear())));

  // Filter data based on the selected year
  const filteredData = dengueData.filter((data) => new Date(data.date).getFullYear() === selectedYear);

  // Format data for the chart
  const formattedData = filteredData.map((data) => ({
    date: data.date,
    cases: data.cases,
    deaths: data.deaths,
  }));

  return (
    <div>
      <h2>Cases and Deaths Over Time</h2>
      <div>
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            style={{
              backgroundColor: selectedYear === year ? '#ddd' : '#fff',
              border: '1px solid #ccc',
              margin: '0 5px',
              padding: '5px 10px',
            }}
          >
            {year}
          </button>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart
          data={formattedData}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="cases" stroke="#8884d8" />
          <Line type="monotone" dataKey="deaths" stroke="#82ca9d" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineChart;
