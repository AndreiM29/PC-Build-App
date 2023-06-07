import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "./Selector.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import caseImage from './Images/case.jpg';
import { Amplify, Auth } from 'aws-amplify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';



const CaseSelector = () => {
  const [token, setAccessToken] = useState('');
  const [selectedCase, setSelectedCase] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [caseOptions, setOptions] = useState([]);
  const [modelsFetched, setModelsFetched] = useState(false);
  const [caseSpecs, setSpecs] = useState('{"specifications": {"Loading": "..."}}');
  const [specsFetched, setSpecsFetched] = useState(false);


  useEffect(() => {
    if (!modelsFetched) {
      Auth.currentSession().then(res => {
        let accessToken = res.getAccessToken();
        let jwt = accessToken.getJwtToken();
        setAccessToken(jwt);
      }).catch(error => console.error(error));

      fetch('https://d8ahjq9ill.execute-api.eu-west-1.amazonaws.com/development/models?type=case', {
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
          if (localStorage.getItem("selectedCase") == "")
            setSelectedCase(modelNames[0]);
        })
        .catch(error => console.log(error));

    }
  })

  useEffect(() => {
    const storedCase = localStorage.getItem("selectedCase");
    if (storedCase) {
      setSelectedCase(storedCase);
      setCurrentIndex(caseOptions.indexOf(storedCase));
    }
  }, []);

  // Handler for case option selection
  const handleCaseSelect = (event) => {
    const selectedCase = event.target.value;
    setSelectedCase(selectedCase);
    setCurrentIndex(caseOptions.indexOf(selectedCase));
    if (caseOptions) { setCurrentIndex(caseOptions.indexOf(selectedCase)); }
    if (specsFetched == false) {
      fetch('https://d8ahjq9ill.execute-api.eu-west-1.amazonaws.com/development/model?type=case&model=' + selectedCase, {
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
    console.log(caseSpecs);
  }

  const addCaseToConfig = (event) => {
    const selectedCase = event.target.value;
    setSelectedCase(selectedCase);
    setCurrentIndex(caseOptions.indexOf(selectedCase));
    localStorage.setItem("selectedCase", selectedCase);
    const message = selectedCase + ' added to current Configuration!'
    toast.success(message);
  };

  return (
    <div class="flex-container">
      <div className="selector-container">
        <img src={caseImage} alt="Case" style={{ width: '80px', height: '80px' }} />
        <Typography variant="h4" className="selector-title">
          Select your Case
        </Typography>
        <Typography variant="body1">Selected Case: {selectedCase}</Typography>
        {modelsFetched && (
          <div className="selector-options">
            <select value={selectedCase} onChange={handleCaseSelect}>
              {caseOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>)}
        <Button
          variant="contained"
          color="secondary"
          onClick={() => addCaseToConfig({ target: { value: selectedCase } })}
        >
          Add Case to configuration
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
              {Object.entries(JSON.parse(caseSpecs).specifications).map(([key, value]) => (
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

export default CaseSelector;
