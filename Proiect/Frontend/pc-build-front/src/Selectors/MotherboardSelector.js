import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "./Selector.css"; // Import the CSS file
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import motherboardImage from './Images/motherboard.jpg';
import { Amplify, Auth } from 'aws-amplify';


const MotherboardSelector = () => {
  const [token, setAccessToken] = useState('');
  const [selectedMotherboard, setSelectedMotherboard] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [motherboardOptions, setOptions] = useState([]);
  const [modelsFetched, setModelsFetched] = useState(false);

  useEffect(() => {
    if (!modelsFetched){
      Auth.currentSession().then(res => {
        let accessToken = res.getAccessToken();
        let jwt = accessToken.getJwtToken();
        setAccessToken(jwt);
      }).catch(error => console.error(error));

      fetch('https://d8ahjq9ill.execute-api.eu-west-1.amazonaws.com/development/models?type=motherboard', {
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
          if (localStorage.getItem("selectedMotherboard") == "")
            setSelectedMotherboard(modelNames[0]);
        })
        .catch(error => console.log(error));
    
  }})

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
  };

  const addMotherboardToConfig = (event) => {
    const selectedMotherboard = event.target.value;
    setSelectedMotherboard(selectedMotherboard);
    setCurrentIndex(motherboardOptions.indexOf(selectedMotherboard));
    localStorage.setItem("selectedMotherboard", selectedMotherboard);
    const message = selectedMotherboard + ' added to current Configuration!'
    toast.success(message);
  };

  return (
    <div className="selector-container">
      <img src={motherboardImage} alt="Motherboard" style={{ width: '80px', height: '80px' }} />
      <Typography variant="h4" className="selector-title">
        Select your Motherboard
      </Typography>
      <Typography variant="body1">Selected Motherboard: {selectedMotherboard}</Typography>
      {modelsFetched && (
      <div className="selector-options">
        <select value={selectedMotherboard} onChange={handleMotherboardSelect}>
          {motherboardOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>)}
      <Button
        variant="contained"
        color="secondary"
        onClick={() => addMotherboardToConfig({ target: { value: selectedMotherboard } })}
      >
        Add Motherboard to configuration
      </Button>
    </div>
  );
};

export default MotherboardSelector;
