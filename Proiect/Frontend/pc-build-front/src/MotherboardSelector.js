import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "./MotherboardSelector.css"; // Import the CSS file

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
    localStorage.setItem("selectedMotherboard", motherboard);
  };

  return (
    <div className="motherboard-selector-container">
      <Typography variant="h4" className="motherboard-selector-title">
        Select your Motherboard
      </Typography>
      <Typography variant="body1">Selected Motherboard: {selectedMotherboard}</Typography>
      <div className="motherboard-selector-options">
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
        onClick={() => handleMotherboardSelect({ target: { value: selectedMotherboard } })}
      >
        Add Motherboard to configuration
      </Button>
    </div>
  );
};

export default MotherboardSelector;
