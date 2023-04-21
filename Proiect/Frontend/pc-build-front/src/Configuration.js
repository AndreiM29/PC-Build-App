import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { Amplify, Auth } from 'aws-amplify';
import './Configuration.css';


const ConfigurationDisplay = () => {
    
    const [token, setAccessToken] = useState('');
  useEffect(() => {
    Auth.currentSession().then(res => {
      let accessToken = res.getAccessToken();
      let jwt = accessToken.getJwtToken();
      setAccessToken(jwt);
      console.log(jwt);
      console.log(accessToken);
    }).catch(error => console.error(error));
  }, []);

  const [config, setConfig] = useState({
    motherboard: "",
    cpu: "",
    gpu: "",
    ram: "",
    storage: "",
    powerSupply: "",
  });

  useEffect(() => {
    const storedMotherboard = localStorage.getItem("selectedMotherboard");
    const storedCPU = localStorage.getItem("selectedCPU");
    const storedGPU = localStorage.getItem("selectedGPU");
    const storedRAM = localStorage.getItem("selectedRAM");
    const storedStorage = localStorage.getItem("selectedStorageDrive");
    const storedPowerSupply = localStorage.getItem("selectedPowerSupply");
    const storedCase = localStorage.getItem("selectedCase");
    
    setConfig({
    motherboard_model: storedMotherboard ||"",
      cpu_model: storedCPU ||"",
      gpu_model: storedGPU ||"",
      ram_model: storedRAM ||"",
      storage_drive_model: storedStorage ||"" ,
      powersupply_model: storedPowerSupply ||"",
      case_model:storedCase||"",
    });
  }, []);

  const handleSendConfig = () => {
  
    fetch('https://d8ahjq9ill.execute-api.eu-west-1.amazonaws.com/development/configuration', {
      method: 'POST',
      body: JSON.stringify({ pc_configuration: config, client: 'Clientu' }),
      headers: {
        'Authorization': `Bearer ${token}`      }
    })
      .then(response => response.json())
      .then(data => console.log(data))
      .catch(error => console.error(error));
  }

  return (
    <div className="config-display">
      <h2>Your current configuration:</h2>
      <p>Motherboard: {config.motherboard_model}</p>
      <p>CPU: {config.cpu_model}</p>
      <p>GPU: {config.gpu_model}</p>
      <p>RAM: {config.ram_model}</p>
      <p>Storage: {config.storage_drive_model}</p>
      <p>Power Supply: {config.powersupply_model}</p>
      <p>Case: {config.case_model}</p>
      <br />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSendConfig}
        className="send-button"
      >
        Send Configuration
      </Button>
    </div>
  );
};

export default ConfigurationDisplay;