import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "./Selector.css"; // Import the CSS file
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ramImage from './Images/ram.jpg';


const RAMSelector = () => {
  const [selectedRAM, setSelectedRAM] = useState("");
  const ramOptions = ["RAM 1", "RAM 2", "RAM 3", "RAM 4"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const storedRAM = localStorage.getItem("selectedRAM");
    if (storedRAM) {
      setSelectedRAM(storedRAM);
      setCurrentIndex(ramOptions.indexOf(storedRAM));
    }
  }, []);

  // Handler for RAM option selection
  const handleRAMSelect = (event) => {
    const selectedRAM = event.target.value;
    setSelectedRAM(selectedRAM);
    setCurrentIndex(ramOptions.indexOf(selectedRAM));
  };

  const addRAMToConfig = (event) => {
    const selectedRAM = event.target.value;
    setSelectedRAM(selectedRAM);
    setCurrentIndex(ramOptions.indexOf(selectedRAM));
    localStorage.setItem("selectedRAM", selectedRAM);
    const message = selectedRAM + ' added to current Configuration!'
    toast.success(message);
  };

  return (
    <div className="selector-container">
      <img src={ramImage} alt="RAM" style={{ width: '80px', height: '80px' }} />
      <Typography variant="h4" className="selector-title">
        Select your RAM
      </Typography>
      <Typography variant="body1">Selected RAM: {selectedRAM}</Typography>
      <div className="selector-options">
        <select value={selectedRAM} onChange={handleRAMSelect}>
          {ramOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => addRAMToConfig({ target: { value: selectedRAM } })}
      >
        Add RAM to configuration
      </Button>
    </div>
  );
};

export default RAMSelector;
