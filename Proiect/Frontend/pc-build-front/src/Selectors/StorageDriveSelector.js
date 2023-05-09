import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "./Selector.css"; // Import the CSS file
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import storageImage from './Images/hdd.jpg';
import { Amplify, Auth } from 'aws-amplify';


const StorageDriveSelector = () => {
  const [token, setAccessToken] = useState('');
  const [selectedStorageDrive, setSelectedStorageDrive] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [storageDriveOptions, setOptions] = useState([]);
  const [modelsFetched, setModelsFetched] = useState(false);

  useEffect(() => {
    if (!modelsFetched){
      Auth.currentSession().then(res => {
        let accessToken = res.getAccessToken();
        let jwt = accessToken.getJwtToken();
        setAccessToken(jwt);
      }).catch(error => console.error(error));

      fetch('https://d8ahjq9ill.execute-api.eu-west-1.amazonaws.com/development/models?type=storage', {
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
          if (localStorage.getItem("selectedStorageDrive") == "")
            setSelectedStorageDrive(modelNames[0]);
        })
        .catch(error => console.log(error));
    
  }})

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
  };

  const addStorageDriveToConfig = (event) => {
    const selectedStorageDrive = event.target.value;
    setSelectedStorageDrive(selectedStorageDrive);
    setCurrentIndex(storageDriveOptions.indexOf(selectedStorageDrive));
    localStorage.setItem("selectedStorageDrive", selectedStorageDrive);
    const message = selectedStorageDrive + ' added to current Configuration!'
    toast.success(message);
  };

  return (
    <div className="selector-container">
      <img src={storageImage} alt="Storage" style={{ width: '80px', height: '80px' }} />
      <Typography variant="h4" className="selector-title">
        Select your Storage Drive
      </Typography>
      <Typography variant="body1">Selected Storage Drive: {selectedStorageDrive}</Typography>
      {modelsFetched && (
      <div className="selector-options">
        <select value={selectedStorageDrive} onChange={handleStorageDriveSelect}>
          {storageDriveOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>)}
      <Button
        variant="contained"
        color="secondary"
        onClick={() => addStorageDriveToConfig({ target: { value: selectedStorageDrive } })}
      >
        Add Storage Drive to configuration
      </Button>
    </div>
  );
};

export default StorageDriveSelector;
