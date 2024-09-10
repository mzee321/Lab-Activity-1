import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const ScatterPlot1 = () => {
  const [dengueData, setDengueData] = useState([]);

  // Fetch dengue data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      const dengueCollection = collection(db, "dengueData");
      const dengueSnapshot = await getDocs(dengueCollection);
      const dataList = dengueSnapshot.docs.map((doc) => ({
        id: doc.id,
        location: doc.data().location,
        cases: doc.data().cases,
        deaths: doc.data().deaths,
        date: doc.data().date,
        regions: doc.data().regions,
        year: doc.data().year
      }));
      setDengueData(dataList);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h2>Dengue Data Scatter Plot (Regions vs. Cases)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart>
          <CartesianGrid />
          {/* XAxis is categorical, showing regions */}
          <XAxis
            dataKey="regions"
            name="Regions"
            type="category"
            label={{ value: "Regions", position: "insideBottomRight", offset: -5 }}
          />
          {/* YAxis shows number of cases */}
          <YAxis
            dataKey="cases"
            name="Cases"
            type="number"
            label={{ value: "Cases", angle: -90, position: "insideLeft" }}
          />
          <Tooltip cursor={{ strokeDasharray: "3 3" }} />
          <Legend />
          <Scatter name="Dengue Data" data={dengueData} fill="#82ca9d" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScatterPlot1;
