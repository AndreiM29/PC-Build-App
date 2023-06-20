import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "./Selector.css"; // Import the CSS file
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import storageImage from './Images/hdd.jpg';
import { Amplify, Auth } from 'aws-amplify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';


const StorageDriveSelector = () => {
  const [token, setAccessToken] = useState('');
  const [selectedStorageDrive, setSelectedStorageDrive] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [storageDriveOptions, setOptions] = useState([]);
  const [modelsFetched, setModelsFetched] = useState(false);
  const [storageSpecs, setSpecs] = useState('{"specifications": {"Loading": "..."}}');
  const [specsFetched, setSpecsFetched] = useState(false);

  useEffect(() => {
    if (!modelsFetched) {
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
          if (modelNames.length > 1) {
            setModelsFetched(true);
          }
          setOptions(modelNames);
          if (localStorage.getItem("selectedStorageDrive") == "")
            setSelectedStorageDrive(modelNames[0]);
        })
        .catch(error => console.log(error));

    }
  })

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
    if (storageDriveOptions) { setCurrentIndex(storageDriveOptions.indexOf(selectedStorageDrive)); }
    if (specsFetched == false) {
      fetch('https://d8ahjq9ill.execute-api.eu-west-1.amazonaws.com/development/model?type=storage&model=' + selectedStorageDrive, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(response =>
        response.json()
      )
        .then(data => {
          setSpecs(JSON.stringify(data));
        })
        .catch(error => console.log(error));
    };
    console.log(storageSpecs);
  }

  const addStorageDriveToConfig = (event) => {
    const selectedStorageDrive = event.target.value;
    setSelectedStorageDrive(selectedStorageDrive);
    setCurrentIndex(storageDriveOptions.indexOf(selectedStorageDrive));
    localStorage.setItem("selectedStorageDrive", selectedStorageDrive);
    const message = selectedStorageDrive + ' added to current Configuration!'
    toast.success(message);
  };

  return (
    <div class="flex-container">
      <div className="selector-container">
        <img src={storageImage} alt="Storage" style={{ width: '80px', height: '80px' }} />
        <Typography variant="h5" className="selector-title">
          Select Storage Drive
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
      <div>
        <TableContainer component={Paper}>
          <Table aria-label="specifications table">
            <TableHead>
              <TableRow>
                <TableCell><b>Specification</b></TableCell>
                <TableCell><b>Value</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(JSON.parse(storageSpecs).specifications).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell component="th" scope="row">{key}</TableCell>
                  <TableCell>{value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div><p>&nbsp;&nbsp;</p></div>
    </div>
  );
};

export default StorageDriveSelector;
