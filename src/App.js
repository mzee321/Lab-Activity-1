import React, { useState } from "react";
import AddDengueData from "./AddDengueData";
import DengueDataList from "./DengueDataList";
import CsvUploader from "./CsvUploader"; 
import TimelineChart from "./TimelineChart";
import PieChartComponent from "./PieChart";
import ScatterPlot from "./ScatterPlot"; 
import ScatterPlot1 from "./ScatterPlot1"; 
import './App.css'; // Import the CSS file if not already imported

function App() {
  const [dataUpdated, setDataUpdated] = useState(false);

  // Function to handle data update
  const handleDataUpload = () => {
    setDataUpdated(!dataUpdated); // Toggle the state to refresh the list
  };

  return (
    <div className="App">
      <h1 className="centered-heading">Dengue Data CRUD App</h1>
      <h4 className="centered-headinz">Click the App Data Button to insert data to a firebase</h4>
      <AddDengueData />
      <CsvUploader onDataUpload={handleDataUpload} />
      <DengueDataList dataUpdated={dataUpdated} />
      <TimelineChart />
      <PieChartComponent />
      <ScatterPlot /> 
      <ScatterPlot1 /> 

    </div>
  );
}

export default App;
