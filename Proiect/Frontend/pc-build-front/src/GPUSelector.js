import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "./GPUSelector.css"; // Import the CSS file

const GPUSelector = () => {
  const [selectedGPU, setSelectedGPU] = useState("");
  const gpuOptions = ["GPU 1", "GPU 2", "GPU 3", "GPU 4"];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const storedGPU = localStorage.getItem("selectedGPU");
    if (storedGPU) {
      setSelectedGPU(storedGPU);
      setCurrentIndex(gpuOptions.indexOf(storedGPU));
    }
  }, []);

  // Handler for GPU option selection
  const handleGPUSelect = (event) => {
    const selectedGPU = event.target.value;
    setSelectedGPU(selectedGPU);
    setCurrentIndex(gpuOptions.indexOf(selectedGPU));
    localStorage.setItem("selectedGPU", selectedGPU);
  };

  return (
    <div className="gpu-selector-container">
      <Typography variant="h4" className="gpu-selector-title">
        Select your GPU
      </Typography>
      <Typography variant="body1">Selected GPU: {selectedGPU}</Typography>
      <div className="gpu-selector-options">
        <select value={selectedGPU} onChange={handleGPUSelect}>
          {gpuOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <Button
        variant="contained"
        color="secondary"
        onClick={() => handleGPUSelect({ target: { value: selectedGPU } })}
      >
        Add GPU to configuration
      </Button>
    </div>
  );
};

export default GPUSelector;
