import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import './account.css';
import Avatar from '@mui/material/Avatar';
import { useState, useEffect } from 'react';
import Dashboard from "../dashboard/dashboard"

function Account(props) {
    const [accounts, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);
    console.log(props);

    useEffect(() => {
        const account = async () => {
            setAccount(props.account);
            setBalance(props.balance);
            console.log("aaaa" + props.balance);
        };
        account();
    }, []);

    return (
        <div className='center'>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh',
                }}
            >
                <Paper elevation={3} className='account-paper'>
                    <Avatar className='avatar' src="/broken-image.jpg" />
                    <div className='account-content'>
                        <h2 className='name'>My Account</h2>
                        <p className='address'>Address: {props.account}</p>
                        <p className='balance'>Balance: {props.balance}</p>
                    </div>
                </Paper>
            </Box>
        </div>
    );
}

export default Account;