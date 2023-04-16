import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "./RAMSelector.css"; // Import the CSS file

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
    localStorage.setItem("selectedRAM", selectedRAM);
  };

  return (
    <div className="ram-selector-container">
      <Typography variant="h4" className="ram-selector-title">
        Select your RAM
      </Typography>
      <Typography variant="body1">Selected RAM: {selectedRAM}</Typography>
      <div className="ram-selector-options">
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
        onClick={() => handleRAMSelect({ target: { value: selectedRAM } })}
      >
        Add RAM to configuration
      </Button>
    </div>
  );
};

export default RAMSelector;
