import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "./CaseSelector.css"; // Import the CSS file

const PowerSupplySelector = () => {
  const [selectedPowerSupply, setSelectedPowerSupply] = useState("");
  const powerSupplyOptions = ["Power Supply 1", "Power Supply 2", "Power Supply 3", "Power Supply 4"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const storedPowerSupply = localStorage.getItem("selectedPowerSupply");
    if (storedPowerSupply) {
      setSelectedPowerSupply(storedPowerSupply);
      setCurrentIndex(powerSupplyOptions.indexOf(storedPowerSupply));
    }
  }, []);

  // Handler for power supply option selection
  const handlePowerSupplySelect = (event) => {
    const selectedPowerSupply = event.target.value;
    setSelectedPowerSupply(selectedPowerSupply);
    setCurrentIndex(powerSupplyOptions.indexOf(selectedPowerSupply));
    localStorage.setItem("selectedPowerSupply", selectedPowerSupply);
  };

  return (
    <div className="case-selector-container">
      <Typography variant="h4" className="case-selector-title">
        Select your Power Supply
      </Typography>
      <Typography variant="body1">Selected Power Supply: {selectedPowerSupply}</Typography>
      <div className="case-selector-options">
        <select value={selectedPowerSupply} onChange={handlePowerSupplySelect}>
          {powerSupplyOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handlePowerSupplySelect({ target: { value: selectedPowerSupply } })}
      >
        Add Power Supply to configuration
      </Button>
    </div>
  );
};

export default PowerSupplySelector;
