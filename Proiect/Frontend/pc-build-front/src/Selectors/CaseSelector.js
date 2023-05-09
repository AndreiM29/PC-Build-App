import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import "./Selector.css"; // Import the CSS file
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import caseImage from './Images/case.jpg';
import { Amplify, Auth } from 'aws-amplify';



const CaseSelector = () => {
  const [token, setAccessToken] = useState('');
  const [selectedCase, setSelectedCase] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [caseOptions, setOptions] = useState([]);
  const [modelsFetched, setModelsFetched] = useState(false);

  useEffect(() => {
    if (!modelsFetched){
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
          if(modelNames.length > 1){
            setModelsFetched(true);
          }
          setOptions(modelNames);
          if (localStorage.getItem("selectedCase") == "")
            setSelectedCase(modelNames[0]);
        })
        .catch(error => console.log(error));
    
  }})

  useEffect(() => {
    const storedCase = localStorage.getItem("selectedCase");
    if (storedCase) {
      setSelectedCase(storedCase);
      //setCurrentIndex(caseOptions.indexOf(storedCase)); 
    }
  }, []);

  // Handler for case option selection
  const handleCaseSelect = (event) => {
    const selectedCase = event.target.value;
    setSelectedCase(selectedCase);
    setCurrentIndex(caseOptions.indexOf(selectedCase));
  };

  const addCaseToConfig = (event) => {
    const selectedCase = event.target.value;
    setSelectedCase(selectedCase);
    setCurrentIndex(caseOptions.indexOf(selectedCase));
    localStorage.setItem("selectedCase", selectedCase);
    const message = selectedCase + ' added to current Configuration!'
    toast.success(message);
  };

  return (
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
  );
};

export default CaseSelector;
