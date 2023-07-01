import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Web3 from 'web3';
import Button from '@mui/material/Button';



function Transactions (props) {
    
    
    const web3 = new Web3(Web3.givenProvider);

    function createData(coin, type, date, quantity, price) {
        return { coin, type, date, quantity, price };
    }

    async function getTransactionHistory() {
        const accounts = await web3.eth.getAccounts();
        const history = await Promise.all(
          accounts.map(async (account) => {
            const transactions = await web3.eth.getTransaction(account);
            return transactions;
          })
        );
        return history;
      }

      async function handleButtonClick() {
        const history = await getTransactionHistory();
        console.log(history);
    }

    const rows = [
        // createData('ETH', 'Buy', '1-1-2023', 69, 1),
        // createData('ETH', 'Buy', '1-1-2023', 69, 1)
    ];

    return (
        <div>
        <Button onClick={handleButtonClick}>Show Transaction History</Button>
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Price</TableCell>
                    <TableCell align="right">Type</TableCell>
                    <TableCell align="right">Date</TableCell>
                    <TableCell align="right">Quantity</TableCell>
                    <TableCell align="right">Price</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                {rows.map((row) => (
                    <TableRow
                    key={row.coin}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                    <TableCell component="th" scope="row">
                        {row.coin}
                    </TableCell>
                    <TableCell align="right">{row.type}</TableCell>
                    <TableCell align="right">{row.date}</TableCell>
                    <TableCell align="right">{row.quantity}</TableCell>
                    <TableCell align="right">{row.price}</TableCell>
                    </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer>

        </div>
    );
}

export default Transactions;