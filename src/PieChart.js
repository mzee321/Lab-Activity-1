import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

// Use a more vibrant and varied color palette
const COLORS = [
  "#FF6384", "#36A2EB", "#FFCE56", "#E57373", "#F06292", "#64B5F6",
  "#4DB6AC", "#81C784", "#FFD54F", "#FF8A65", "#A1887F", "#D32F2F",
  "#1976D2", "#388E3C", "#FBC02D"
];

const PieChartComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const dengueCollection = collection(db, "dengueData");
      const dengueSnapshot = await getDocs(dengueCollection);
      const dataList = dengueSnapshot.docs.map((doc) => doc.data());

      const regionCounts = dataList.reduce((acc, item) => {
        const { regions } = item;
        if (regions in acc) {
          acc[regions] += item.cases;
        } else {
          acc[regions] = item.cases;
        }
        return acc;
      }, {});

      const formattedData = Object.keys(regionCounts).map((region) => ({
        name: region,
        value: regionCounts[region],
      }));

      setData(formattedData);
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: '100%', height: 400 }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Dengue Cases by Region</h2>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
            labelLine={false}
            animationDuration={1000}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} cases`} />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconSize={14}
            wrapperStyle={{
              fontSize: '14px',
              marginTop: '20px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PieChartComponent;
