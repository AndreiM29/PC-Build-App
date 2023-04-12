import { Amplify, Auth } from 'aws-amplify';
import { useState, useEffect } from 'react';

import { withAuthenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import './App.css';

import awsExports from './aws-exports';
import { API } from 'aws-amplify';
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
      fetch('https://d8ahjq9ill.execute-api.eu-west-1.amazonaws.com/development/configuration', {
        method: 'POST',
        body: "{\"pc_configuration\": {\"cpu_model\": \"Intel Core i9\",\"motherboard_model\": \"ASUS Prime Z390-A\",\"gpu_model\": \"NVIDIA GeForce RTX 3080\",\"ram_model\": \"Corsair Vengeance LPX 16GB\",\"storage_drive_model\": \"Samsung 970 EVO Plus 1TB\",\"case_model\": \"NZXT H510i\",\"powersupply_model\": \"EVGA SuperNOVA 850 G3\"}}"
        , headers: {
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
      <button onClick={signOut}>Sign out</button>
    </>
  );
}
//Fa sa iaceva de la lambda prin API+Scris
export default withAuthenticator(App);

/*import logo from './logo.svg';
import { Amplify, Auth } from 'aws-amplify';
import awsconfig from './aws-exports';
Amplify.configure(awsconfig);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;*/
