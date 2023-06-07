import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "./Selector.css"; // Import the CSS file
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import cpuImage from './Images/cpu.jpg';
import { Amplify, Auth } from 'aws-amplify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';




const CPUSelector = () => {
  const [selectedCPU, setSelectedCPU] = useState("");
  const [token, setAccessToken] = useState('');
  const [cpuOptions, setOptions] = useState([]);
  const [cpuSpecs, setSpecs] = useState('{"specifications": {"Loading": "..."}}');
  const [modelsFetched, setModelsFetched] = useState(false);
  const [specsFetched, setSpecsFetched] = useState(false);


  useEffect(() => {
    if (!modelsFetched) {
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
          if (modelNames.length > 1) {
            setModelsFetched(true);
          }
          setOptions(modelNames);
          if (localStorage.getItem("selectedCPU") == "")
            setSelectedCPU(modelNames[0]);
        })
        .catch(error => console.log(error));

    }
  })

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
    if (cpuOptions) { setCurrentIndex(cpuOptions.indexOf(selectedCPU)); }
    if (specsFetched == false) {
      fetch('https://d8ahjq9ill.execute-api.eu-west-1.amazonaws.com/development/model?type=cpu&model=' + selectedCPU, {
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
    console.log(cpuSpecs);
  }

  const addCPUToConfig = (event) => {
    const selectedCPU = event.target.value;
    setSelectedCPU(selectedCPU);
    setCurrentIndex(cpuOptions.indexOf(selectedCPU));
    localStorage.setItem("selectedCPU", selectedCPU);
    const message = selectedCPU + ' added to current Configuration!'
    toast.success(message);
  };

  return (
    <div class="flex-container">
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
        <div>
          <h2>CPU Specs</h2>
        </div>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => addCPUToConfig({ target: { value: selectedCPU } })}
        >
          Add CPU to configuration
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
              {Object.entries(JSON.parse(cpuSpecs).specifications).map(([key, value]) => (
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

export default CPUSelector;
