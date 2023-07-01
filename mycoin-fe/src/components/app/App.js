import './App.css';
import Navbar from '../common/navbar';
import Dashboard from '../dashboard/dashboard';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import { useCookies } from "react-cookie";
import { Routes, Route, useNavigate, Outlet } from "react-router-dom";
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from '../../utils/load-contract';
import { useState,  useEffect } from 'react';
import Transactions from '../transactions/transactions';
import Account from '../account/account';

const drawerWidth = 240;

function App() {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });
  const [cookies, setCookie, removeCookie] = useCookies(["token"]);
  const [account, setAccount] = useState(null);

  const onSignIn = async () => {
    await web3Api.provider.request({method: "eth_requestAccounts"});
  };

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider();
      const contract = await loadContract("faucet", provider);
      
      // debugger

      if (provider) {
        setWeb3Api({
          web3: new Web3(provider),
          provider,
          contract
        })
      }
      else {
        console.error("please install metamask");
      }
    }
    loadProvider();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      const accounts = await web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    };
    web3Api.web3 && getAccount();
  }, [web3Api.web3]);

  return (
    <div className='App'>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Navbar onSignin={() => onSignIn()} setCookie={setCookie}/>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
        >
          <Toolbar />
          <Routes>
            <Route path='/' element={<Dashboard/>} />
            <Route path='/transactions' element={<Transactions />} />
            <Route path='/account' element={<Account account={account}/>} />
          </Routes>
          
        </Box>
      </Box>
    </div>
  );
}

export default App;
