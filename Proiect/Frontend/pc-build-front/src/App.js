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
import CPUSelector from './CPUSelector';
import GPUSelector from './GPUSelector';
import RAMSelector from './RAMSelector';

import { BrowserRouter as Router, Route, NavLink, Routes } from "react-router-dom";
import awsExports from './aws-exports';
import MotherboardSelector from "./MotherboardSelector";
import CaseSelector from "./CaseSelector";
import HomePage from "./HomePage";
import { API } from 'aws-amplify';
import StorageDriveSelector from './StorageDriveSelector';
import PowerSupplySelector from './PowerSupplySelector';

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
      console.log(jwt);
      console.log(accessToken);
    }).catch(error => console.error(error));
    setFoo('foo value');
  }, []);


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


  return (
    <>
      <h1>Hi {user.username}</h1>
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

      <Router>
        <div>
          <Menu />
          <hr />
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/motherboards" element={<MotherboardSelector />} />
            <Route path="/cases" element={<CaseSelector/>} />
            <Route path="/cpus" element={<CPUSelector/>} />
            <Route path="/gpus" element={<GPUSelector/>} />
            <Route path="/ram" element={<RAMSelector/>} />
            <Route path="/storagedrive" element={<StorageDriveSelector/>} />
            <Route path="/powersupply" element={<PowerSupplySelector/>} />
            {/* Add more routes for other pages/components as needed */}
          </Routes>
        </div>
      </Router>
    </>
  );
}
export default withAuthenticator(App);
