import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "./Selector.css"; // Import the CSS file
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import motherboardImage from './Images/motherboard.jpg';


const MotherboardSelector = () => {
  const [selectedMotherboard, setSelectedMotherboard] = useState("");
  const motherboardOptions = ["Motherboard 1", "Motherboard 2", "Motherboard 3", "Motherboard 4"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const storedMotherboard = localStorage.getItem("selectedMotherboard");
    if (storedMotherboard) {
      setSelectedMotherboard(storedMotherboard);
      setCurrentIndex(motherboardOptions.indexOf(storedMotherboard));
    }
  }, []); 

  // Handler for motherboard option selection
  const handleMotherboardSelect = (event) => {
    const motherboard = event.target.value;
    setSelectedMotherboard(motherboard);
    setCurrentIndex(motherboardOptions.indexOf(motherboard));
  };

  const addMotherboardToConfig = (event) => {
    const selectedMotherboard = event.target.value;
    setSelectedMotherboard(selectedMotherboard);
    setCurrentIndex(motherboardOptions.indexOf(selectedMotherboard));
    localStorage.setItem("selectedMotherboard", selectedMotherboard);
    const message = selectedMotherboard + ' added to current Configuration!'
    toast.success(message);
  };

  return (
    <div className="selector-container">
      <img src={motherboardImage} alt="Motherboard" style={{ width: '80px', height: '80px' }} />
      <Typography variant="h4" className="selector-title">
        Select your Motherboard
      </Typography>
      <Typography variant="body1">Selected Motherboard: {selectedMotherboard}</Typography>
      <div className="selector-options">
        <select value={selectedMotherboard} onChange={handleMotherboardSelect}>
          {motherboardOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => addMotherboardToConfig({ target: { value: selectedMotherboard } })}
      >
        Add Motherboard to configuration
      </Button>
    </div>
  );
};

export default MotherboardSelector;
