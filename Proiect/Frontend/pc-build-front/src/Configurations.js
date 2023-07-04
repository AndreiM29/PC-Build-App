import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import CancelIcon from '@material-ui/icons/Cancel';




function Configurations() {
    
    const [data, setData] = useState([]);
    const [token, setAccessToken] = useState('');
    const [modelsFetched, setModelsFetched] = useState(false);

    useEffect(() => {
        Auth.currentSession().then(res => {
            let accessToken = res.getAccessToken();
            let jwt = accessToken.getJwtToken();
            setAccessToken(jwt);
        }).catch(error => console.error(error));
    }, []);

    useEffect(() => {
        if (!modelsFetched) {
          Auth.currentSession().then(res => {
            let accessToken = res.getAccessToken();
            let jwt = accessToken.getJwtToken();
            setAccessToken(jwt);
          }).catch(error => console.error(error));
    
          fetch('https://d8ahjq9ill.execute-api.eu-west-1.amazonaws.com/development/configurations', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }).then(response =>
            response.json()
          )
            .then(data => {
                if(Array.isArray(data.Items))
                    {setData(data.Items);
                    setModelsFetched(true);}
            })
            .catch(error => console.log(error));
    
        }
      })

    return (
        <TableContainer component={Paper}>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Client</TableCell>
                        <TableCell>CPU Model</TableCell>
                        <TableCell style={{ paddingLeft: '0px' }}>Ready</TableCell>
                        <TableCell>GPU Model</TableCell>
                        <TableCell style={{ paddingLeft: '0px' }}>Ready</TableCell>
                        <TableCell>RAM Model</TableCell>
                        <TableCell style={{ paddingLeft: '0px' }}>Ready</TableCell>
                        <TableCell>Motherboard Model</TableCell>
                        <TableCell style={{ paddingLeft: '0px' }}>Ready</TableCell>
                        <TableCell>Storage Drive Model</TableCell>
                        <TableCell style={{ paddingLeft: '0px' }}>Ready</TableCell>
                        <TableCell>Power Supply Model</TableCell>
                        <TableCell style={{ paddingLeft: '0px' }}>Ready</TableCell>
                        <TableCell>Case Model</TableCell>
                        <TableCell style={{ paddingLeft: '0px' }}>Ready</TableCell>
                        <TableCell style={{ paddingLeft: '0px' , paddingRight: '0px'}}>All Available</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item,index) => (
                        <TableRow key={index}>
                            <TableCell>{index  + 1}</TableCell>
                            <TableCell>{item.client}</TableCell>
                            <TableCell>{item.cpu_model}</TableCell>
                            <TableCell style={{ paddingLeft: '0px' }}>{item.cpu_available == 'True' ? (
                  <CheckCircleIcon style={{ color: 'green' }} />
                ) : (
                    <CancelIcon style={{ color: 'red' }} />
                  )}</TableCell>
                            <TableCell>{item.gpu_model}</TableCell>
                            <TableCell style={{ paddingLeft: '0px' }}>{item.gpu_available == 'True' ? (
                  <CheckCircleIcon style={{ color: 'green' }} />
                ) : (
                    <CancelIcon style={{ color: 'red' }} />
                  )}</TableCell>
                            <TableCell>{item.ram_model}</TableCell>
                            <TableCell style={{ paddingLeft: '0px' }}>{item.ram_available == 'True' ? (
                  <CheckCircleIcon style={{ color: 'green' }} />
                ) : (
                    <CancelIcon style={{ color: 'red' }} />
                  )}</TableCell>
                            <TableCell>{item.motherboard_model}</TableCell>
                            <TableCell style={{ paddingLeft: '0px' }}>{item.motherboard_available == 'True' ? (
                  <CheckCircleIcon style={{ color: 'green' }} />
                ) : (
                    <CancelIcon style={{ color: 'red' }} />
                  )}</TableCell>
                            <TableCell>{item.storage_drive_model}</TableCell>
                            <TableCell style={{ paddingLeft: '0px' }}>{item.storage_drive_available == 'True' ? (
                  <CheckCircleIcon style={{ color: 'green' }} />
                ) : (
                    <CancelIcon style={{ color: 'red' }} />
                  )}</TableCell>
                            <TableCell>{item.powersupply_model}</TableCell>
                            <TableCell style={{ paddingLeft: '0px' }}>{item.powersupply_available == 'True' ? (
                  <CheckCircleIcon style={{ color: 'green' }} />
                ) : (
                    <CancelIcon style={{ color: 'red' }} />
                  )}</TableCell>
                            <TableCell>{item.case_model}</TableCell>
                            <TableCell style={{ paddingLeft: '0px' }}>{item.case_available == 'True' ? (
                  <CheckCircleIcon style={{ color: 'green' }} />
                ) : (
                    <CancelIcon style={{ color: 'red' }} />
                  )}</TableCell>
                            <TableCell style={{ paddingLeft: '0px', paddingRight: '0px' }}>{item.all_available == 'True' ? (
                  <CheckCircleIcon style={{ color: 'green' }} />
                ) : (
                    <CancelIcon style={{ color: 'red' }} />
                  )}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default Configurations;