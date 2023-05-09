import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "./Selector.css"; // Import the CSS file
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import gpuImage from './Images/gpu.jpg';
import { Amplify, Auth } from 'aws-amplify';


const GPUSelector = () => {
  const [token, setAccessToken] = useState('');
  const [selectedGPU, setSelectedGPU] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gpuOptions, setOptions] = useState([]);
  const [modelsFetched, setModelsFetched] = useState(false);

  useEffect(() => {
    if (!modelsFetched){
      Auth.currentSession().then(res => {
        let accessToken = res.getAccessToken();
        let jwt = accessToken.getJwtToken();
        setAccessToken(jwt);
      }).catch(error => console.error(error));

      fetch('https://d8ahjq9ill.execute-api.eu-west-1.amazonaws.com/development/models?type=gpu', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(response => 
        response.json()
      )
        .then(data => {
          const modelNames = data.models.map(model => model.S);
          console.log(modelNames);
          if(modelNames.length > 1){
            setModelsFetched(true);
          }
          setOptions(modelNames);
          if (localStorage.getItem("selectedGPU") == "")
            setSelectedGPU(modelNames[0]);
        })
        .catch(error => console.log(error));
    
  }})

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
      <img src={gpuImage} alt="GPU" style={{ width: '80px', height: '80px' }} />
      <Typography variant="h4" className="selector-title">
        Select your GPU
      </Typography>
      <Typography variant="body1">Selected GPU: {selectedGPU}</Typography>
      {modelsFetched && (
      <div className="selector-options">
        <select value={selectedGPU} onChange={handleGPUSelect}>
          {gpuOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>)}
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
