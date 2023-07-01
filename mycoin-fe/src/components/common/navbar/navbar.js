import * as React from 'react';
import Web3 from 'web3';
import { useState,  useEffect } from 'react';
import detectEthereumProvider from '@metamask/detect-provider';
import { loadContract } from '../../../utils/load-contract';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonIcon from '@mui/icons-material/Person';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

const drawerWidth = 240;

function Navbar(props) {
    const { onSignin, setCookie, window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [web3Api, setWeb3Api] = useState({
      provider: null,
      web3: null,
      contract: null,
    });
    const [account, setAccount] = useState(null);
  
    const handleDrawerToggle = () => {
      setMobileOpen(!mobileOpen);
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
  
    const drawer = (
      <div>
        <Toolbar />
        <Divider />
        <List>
            <ListItem key="Account" disablePadding>
              <ListItemButton href="/account">
                <ListItemIcon>
                  <PersonIcon/>
                </ListItemIcon>
                <ListItemText primary="Account" />
              </ListItemButton>
            </ListItem>
            <ListItem key="Transactions" disablePadding>
              <ListItemButton href="/transactions">
                <ListItemIcon>
                  <ListAltIcon />
                </ListItemIcon>
                <ListItemText primary="Transactions" />
              </ListItemButton>
            </ListItem>
        </List>
      </div>
    );
  
    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <div>
            <AppBar
                position="fixed"
                sx={{
                  width: { sm: `calc(100% - ${drawerWidth}px)` },
                  ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar sx={{ justifyContent: "space-between" }}>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>
                    {/* <Typography variant="h6" noWrap component="div" href='/'>
                        DCoin
                    </Typography> */}
                    <IconButton href='/'>
                      <HomeOutlinedIcon/>
                    </IconButton>
                    <div className='align-right'>
                      <Button 
                        color="inherit"
                        onClick={() => onSignin()}
                      >
                        Login
                      </Button>
                    </div>
                </Toolbar>
            </AppBar>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
                
            >
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    style={{backgroundColor: '#1976d2'}}
                >
                {drawer}
                </Drawer>
                <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
                open
                >
                {drawer}
                </Drawer>
            </Box>
        </div>
    );
}

export default Navbar;