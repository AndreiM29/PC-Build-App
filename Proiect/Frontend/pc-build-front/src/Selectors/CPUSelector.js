import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "./Selector.css"; // Import the CSS file
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import cpuImage from './Images/cpu.jpg';


const CPUSelector = () => {
  const [selectedCPU, setSelectedCPU] = useState("");
  const cpuOptions = ["CPU 1", "CPU 2", "CPU 3", "CPU 4"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const storedCPU = localStorage.getItem("selectedCPU");
    if (storedCPU) {
      setSelectedCPU(storedCPU);
      setCurrentIndex(cpuOptions.indexOf(storedCPU));
    }
  }, []);

  // Handler for CPU option selection
  const handleCPUSelect = (event) => {
    const selectedCPU = event.target.value;
    setSelectedCPU(selectedCPU);
    setCurrentIndex(cpuOptions.indexOf(selectedCPU));
  };

  const addCPUToConfig = (event) => {
    const selectedCPU = event.target.value;
    setSelectedCPU(selectedCPU);
    setCurrentIndex(cpuOptions.indexOf(selectedCPU));
    localStorage.setItem("selectedCPU", selectedCPU);
    const message = selectedCPU + ' added to current Configuration!'
    toast.success(message);
  };

  return (
    <div className="selector-container">
      <img src={cpuImage} alt="CPU" style={{ width: '80px', height: '80px' }} />
      <Typography variant="h4" className="selector-title">
        Select your CPU
      </Typography>
      <Typography variant="body1">Selected CPU: {selectedCPU}</Typography>
      <div className="selector-options">
        <select value={selectedCPU} onChange={handleCPUSelect}>
          {cpuOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => addCPUToConfig({ target: { value: selectedCPU } })}
      >
        Add CPU to configuration
      </Button>
    </div>
  );
};

export default CPUSelector;
