import React, { useState, useEffect } from 'react';
import { Auth } from 'aws-amplify';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';


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
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Client</TableCell>
                        <TableCell>CPU Model</TableCell>
                        <TableCell>CPU Available</TableCell>
                        <TableCell>GPU Model</TableCell>
                        <TableCell>GPU Available</TableCell>
                        <TableCell>RAM Model</TableCell>
                        <TableCell>RAM Available</TableCell>
                        <TableCell>Motherboard Model</TableCell>
                        <TableCell>Motherboard Available</TableCell>
                        <TableCell>Storage Drive Model</TableCell>
                        <TableCell>Storage Drive Available</TableCell>
                        <TableCell>Power Supply Model</TableCell>
                        <TableCell>Power Supply Available</TableCell>
                        <TableCell>Case Model</TableCell>
                        <TableCell>Case Available</TableCell>
                        <TableCell>All Available</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.map((item,index) => (
                        <TableRow key={index}>
                            <TableCell>{index  + 1}</TableCell>
                            <TableCell>{item.client}</TableCell>
                            <TableCell>{item.cpu_model}</TableCell>
                            <TableCell>{item.cpu_available}</TableCell>
                            <TableCell>{item.gpu_model}</TableCell>
                            <TableCell>{item.gpu_available}</TableCell>
                            <TableCell>{item.ram_model}</TableCell>
                            <TableCell>{item.ram_available}</TableCell>
                            <TableCell>{item.motherboard_model}</TableCell>
                            <TableCell>{item.motherboard_available}</TableCell>
                            <TableCell>{item.storage_drive_model}</TableCell>
                            <TableCell>{item.storage_drive_available}</TableCell>
                            <TableCell>{item.powersupply_model}</TableCell>
                            <TableCell>{item.powersupply_available}</TableCell>
                            <TableCell>{item.case_model}</TableCell>
                            <TableCell>{item.case_available}</TableCell>
                            <TableCell>{item.all_available}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default Configurations;