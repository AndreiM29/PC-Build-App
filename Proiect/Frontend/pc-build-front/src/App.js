import { Amplify, Auth } from 'aws-amplify';
import { useState, useEffect } from 'react';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './App.css';
import './Menu.css';
import Menu from './Menu'; // Import the Menu component
import Button from "@material-ui/core/Button";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Box from "@material-ui/core/Box";
import CPUSelector from './Selectors/CPUSelector';
import GPUSelector from './Selectors/GPUSelector';
import RAMSelector from './Selectors/RAMSelector';

import { BrowserRouter as Router, Route, NavLink, Routes } from "react-router-dom";
import awsExports from './aws-exports';
import MotherboardSelector from "./Selectors/MotherboardSelector";
import CaseSelector from "./Selectors/CaseSelector";
import HomePage from "./HomePage";
import { API } from 'aws-amplify';
import StorageDriveSelector from './Selectors/StorageDriveSelector';
import PowerSupplySelector from './Selectors/PowerSupplySelector';
import ConfigurationDisplay from './Configuration';
import Configurations from './Configurations';

import { ToastContainer, toast } from 'react-toastify';

Amplify.configure(awsExports);


function App({ signOut, user }) {

  const [foo, setFoo] = useState('');
  const [result, setResult] = useState(null);
  const [token, setAccessToken] = useState('');
  useEffect(() => {
    Auth.currentSession().then(res => {
      let accessToken = res.getAccessToken();
      let jwt = accessToken.getJwtToken();
      setAccessToken(jwt);
    }).catch(error => console.error(error));
    setFoo('foo value');
  }, []);

/*
  useEffect(() => {
    if (foo === 'foo value') {
      const client = 'Clientu';
      const configuration = {
        pc_configuration: {
          cpu_model: 'Intel Core i9',
          motherboard_model: 'ASUS Prime Z390-A',
          gpu_model: 'NVIDIA GeForce RTX 3080',
          ram_model: 'Corsair Vengeance LPX 16GB',
          storage_drive_model: 'Samsung 970 EVO Plus 1TB',
          case_model: 'NZXT H510i',
          powersupply_model: 'EVGA SuperNOVA 850 G3'
        },
        client: client
      };
      fetch('https://d8ahjq9ill.execute-api.eu-west-1.amazonaws.com/development/configuration', {
        method: 'POST',
        body: JSON.stringify(configuration),
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error))
    }
  })
*/

  return (
    <>
      <ToastContainer />
      <div style={{ position: 'absolute', top: 15, right: 10 }}>
        <Box
          position="fixed"
          top={0}
          right={0}
          zIndex={9999}
          p={2}
        >
          <Button
            variant="contained"
            color="secondary"
            startIcon={<ExitToAppIcon />}
            onClick={signOut}
          >
            Sign Out
          </Button>
        </Box>
      </div>
      <Router>
        <div>
          <Menu />
          <hr />
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/motherboards" element={<MotherboardSelector />} />
            <Route path="/cases" element={<CaseSelector />} />
            <Route path="/cpus" element={<CPUSelector />} />
            <Route path="/gpus" element={<GPUSelector />} />
            <Route path="/ram" element={<RAMSelector />} />
            <Route path="/storagedrive" element={<StorageDriveSelector />} />
            <Route path="/powersupply" element={<PowerSupplySelector />} />
            <Route path="/configuration" element={<ConfigurationDisplay />} />
            <Route path="/configurations" element={<Configurations />} />
            {/* Add more routes for other pages/components as needed */}
          </Routes>
        </div>
      </Router>
    </>
  );



}
export default withAuthenticator(App);
