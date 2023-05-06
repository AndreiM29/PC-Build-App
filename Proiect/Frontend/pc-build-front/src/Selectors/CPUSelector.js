import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "./Selector.css"; // Import the CSS file
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import cpuImage from './Images/cpu.jpg';
import { Amplify, Auth } from 'aws-amplify';



const CPUSelector = () => {
  const [selectedCPU, setSelectedCPU] = useState("");
  const [token, setAccessToken] = useState('');
  const [cpuOptions, setOptions] = useState([]);
  const [modelsFetched, setModelsFetched] = useState(false);

  useEffect(() => {
    if (!modelsFetched){
      Auth.currentSession().then(res => {
        let accessToken = res.getAccessToken();
        let jwt = accessToken.getJwtToken();
        setAccessToken(jwt);
      }).catch(error => console.error(error));

      fetch('https://d8ahjq9ill.execute-api.eu-west-1.amazonaws.com/development/models?type=cpu', {
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
        })
        .catch(error => console.log(error));
    
  }})

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const storedCPU = localStorage.getItem("selectedCPU");
    if (storedCPU) {
      setSelectedCPU(storedCPU);
      if (cpuOptions)
        setCurrentIndex(cpuOptions.indexOf(storedCPU));
    }
  }, []);

  // Handler for CPU option selection
  const handleCPUSelect = (event) => {
    const selectedCPU = event.target.value;
    setSelectedCPU(selectedCPU);
    if (cpuOptions)
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
      {modelsFetched && (
      <div className="selector-options">
        <select value={selectedCPU} onChange={handleCPUSelect}>
          {cpuOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>)}
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
