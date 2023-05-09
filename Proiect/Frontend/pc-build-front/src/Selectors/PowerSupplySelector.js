import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "./Selector.css"; // Import the CSS file
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import powerSupplyImage from './Images/power_supply.jpg';
import { Amplify, Auth } from 'aws-amplify';


const PowerSupplySelector = () => {
  const [token, setAccessToken] = useState('');
  const [selectedPowerSupply, setSelectedPowerSupply] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [powerSupplyOptions, setOptions] = useState([]);
  const [modelsFetched, setModelsFetched] = useState(false);

  useEffect(() => {
    if (!modelsFetched){
      Auth.currentSession().then(res => {
        let accessToken = res.getAccessToken();
        let jwt = accessToken.getJwtToken();
        setAccessToken(jwt);
      }).catch(error => console.error(error));

      fetch('https://d8ahjq9ill.execute-api.eu-west-1.amazonaws.com/development/models?type=power', {
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
          if (localStorage.getItem("selectedPowerSupply") == "")
            setSelectedPowerSupply(modelNames[0]);
        })
        .catch(error => console.log(error));
    
  }})

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
  };

  const addPowerSupplyToConfig = (event) => {
    const selectedPowerSupply = event.target.value;
    setSelectedPowerSupply(selectedPowerSupply);
    setCurrentIndex(powerSupplyOptions.indexOf(selectedPowerSupply));
    localStorage.setItem("selectedPowerSupply", selectedPowerSupply);
    const message = selectedPowerSupply + ' added to current Configuration!'
    toast.success(message);
  };

  return (
    <div className="selector-container">
      <img src={powerSupplyImage} alt="Power Supply" style={{ width: '80px', height: '80px' }} />
      <Typography variant="h4" className="selector-title">
        Select your Power Supply
      </Typography>
      <Typography variant="body1">Selected Power Supply: {selectedPowerSupply}</Typography>
      {modelsFetched && (
      <div className="selector-options">
        <select value={selectedPowerSupply} onChange={handlePowerSupplySelect}>
          {powerSupplyOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>)}
      <Button
        variant="contained"
        color="secondary"
        onClick={() => addPowerSupplyToConfig({ target: { value: selectedPowerSupply } })}
      >
        Add Power Supply to configuration
      </Button>
    </div>
  );
};

export default PowerSupplySelector;
