import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "./Selector.css"; // Import the CSS file
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
    //localStorage.setItem("selectedGPU", selectedGPU);
  };

  const addGPUToConfig = (event) => {
    const selectedGPU = event.target.value;
    setSelectedGPU(selectedGPU);
    setCurrentIndex(gpuOptions.indexOf(selectedGPU));
    localStorage.setItem("selectedGPU", selectedGPU);
    const message = selectedGPU + ' added to current Configuration!'
    toast.success(message);
  };

  return (
    <div className="selector-container">
      <Typography variant="h4" className="selector-title">
        Select your GPU
      </Typography>
      <Typography variant="body1">Selected GPU: {selectedGPU}</Typography>
      <div className="selector-options">
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
        onClick={() => addGPUToConfig({ target: { value: selectedGPU } })}
      >
        Add GPU to configuration
      </Button>
    </div>
  );
};

export default GPUSelector;
