import './dashboard.css';
import Web3 from 'web3';
import { useState, useEffect, useCallback } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from '../../utils/load-contract';
import InputIcon from '@mui/icons-material/Input';
import OutputIcon from '@mui/icons-material/Output';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import Account from '../account/account';
import SentForm from '../sentForm/sentForm';

import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

function Dashboard(props) {

  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
  });
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [shouldReload, setShouldReload] = useState(false);

  const [sendToAddress, setSendToAddress] = useState("");
  const [amountSend, setAmountSend] = useState(0);

  const reloadEffect = () => { setShouldReload(!shouldReload) };


  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function handleSubmit() {
    // const _payload = {
    //   "address": sendToAddress,
    //   "amount": parseInt(amountSend)
    // }
    
    sentCoin(sendToAddress, amountSend);
    // sendTransaction(_payload).then((_data) => {
    //   console.log(_data);
    // });

    setOpen(false);
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

  useEffect(() => {
    const loadBalance = async () => {
      const { contract, web3 } = web3Api;

      console.log(contract.address);
      const _balance = await web3.eth.getBalance(contract.address);
      // console.log(_balance);

      setBalance(await web3.utils.fromWei(_balance, "ether"));
     
    };
    web3Api.contract && loadBalance()
  }, [web3Api, reloadEffect])

  const addFunds = useCallback(async () => {
    const { contract, web3 } = web3Api;
    const result = await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether")
    });
    console.log(result);
    reloadEffect();
  }, [web3Api, account]);

  const withdraw = async () => {
    const { contract, web3 } = web3Api;
    const withdrawAmount = web3.utils.toWei("1", "ether");
    const result = await contract.withdraw(withdrawAmount, {
      from: account
    });
    console.log(result);
    reloadEffect();
  };
  
  const sentCoin = async (sendToAddress, amountSend) =>{
    const { contract, web3 } = web3Api;
    const transactionParameters = {
      from: account,
      to: sendToAddress,
      value: web3.utils.toWei(String(amountSend), "ether")
    };
    const transactionHarsh = await web3.eth.sendTransaction(transactionParameters);
    return transactionHarsh;
    reloadEffect();
  }

  const requestAccount = async () => {

    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log(accounts)
      } catch (error) {
        console.log(error)
      }
    }
  }
    

  return (
    <div>
      {/* <Button onClick={handleButtonClick}>Show Transaction History</Button> */}

      <div className='balance-view is-size-2'>
        Current Balance: <strong>{balance ? balance : 0}</strong>ETH
      </div>
      <span>
        <p>
          <strong> Accounts Address: </strong>
          {
            account ? account : "Account Denied"
          }
        </p>
      </span>
      <div className='wallet-controllers'>
        <div className='network-activity__action-wrap'>
          <div className='network-activity__action-item'>
            <a
              onClick={addFunds}
              className='network-activity__action-item'
            >
              <InputIcon />
              Deposit
            </a>
          </div>
          <div className='network-activity__action-divider'></div>
          <div className='network-activity__action-item'>
            <a
              onClick={withdraw}
              className='network-activity__action-item'
            >
              <CreditCardIcon />
              Withdraw
            </a>
          </div>
          <div className='network-activity__action-divider'></div>
          <div className='network-activity__action-item'>
            <a
              onClick={handleClickOpen}
              className='network-activity__action-item'
            >
              <OutputIcon />
              Send
            </a>
            
          </div>
          <div className='network-activity__action-divider'></div>
          <div className='network-activity__action-item'>
            <a
              onClick={requestAccount} 
              className='network-activity__action-item'
            >
              <SwapHorizontalCircleIcon />
              Swap
            </a>
          </div>
        </div>

      </div>
      

      

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>SEND COIN</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Enter that informations
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="address"
            placeholder="Address"
            type="text"
            fullWidth
            variant="standard"
            onChange={(event) =>
              setSendToAddress(event.target.value)
            }
          />
          <TextField
            margin="dense"
            id="amount"
            placeholder="Amount"
            type="number"
            fullWidth
            variant="standard"
            onChange={(event) =>
              setAmountSend(event.target.value)
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Send</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default Dashboard;
