import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "./CaseSelector.css"; // Import the CSS file

const StorageDriveSelector = () => {
  const [selectedStorageDrive, setSelectedStorageDrive] = useState("");
  const storageDriveOptions = ["Storage Drive 1", "Storage Drive 2", "Storage Drive 3", "Storage Drive 4"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const storedStorageDrive = localStorage.getItem("selectedStorageDrive");
    if (storedStorageDrive) {
      setSelectedStorageDrive(storedStorageDrive);
      setCurrentIndex(storageDriveOptions.indexOf(storedStorageDrive));
    }
  }, []);

  // Handler for storage drive option selection
  const handleStorageDriveSelect = (event) => {
    const selectedStorageDrive = event.target.value;
    setSelectedStorageDrive(selectedStorageDrive);
    setCurrentIndex(storageDriveOptions.indexOf(selectedStorageDrive));
    localStorage.setItem("selectedStorageDrive", selectedStorageDrive);
  };

  return (
    <div className="case-selector-container">
      <Typography variant="h4" className="case-selector-title">
        Select your Storage Drive
      </Typography>
      <Typography variant="body1">Selected Storage Drive: {selectedStorageDrive}</Typography>
      <div className="case-selector-options">
        <select value={selectedStorageDrive} onChange={handleStorageDriveSelect}>
          {storageDriveOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleStorageDriveSelect({ target: { value: selectedStorageDrive } })}
      >
        Add Storage Drive to configuration
      </Button>
    </div>
  );
};

export default StorageDriveSelector;
