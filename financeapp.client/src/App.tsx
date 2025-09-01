import { useEffect, useState } from 'react';
import './App.css';

interface Transaction {
    date: string;
    description: string;
    type: string;
    amount: number;
    balance: number;
    isPosted: boolean;
}

function App() {

    // Uncomment for debugging only
    // const apiUrl = import.meta.env.VITE_TARGET;
    // console.log('API URL:', apiUrl);
    
    const [transactions, setTransactions] = useState<Transaction[]>();

    useEffect(() => {
        populateTransactionData();
    }, []);

    const contents = transactions === undefined
        ? <p><em>Loading...</em></p>
        : <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
            <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Balance</th>
                <th>Status</th>
            </tr>
            </thead>
            <tbody>
            {transactions.map(transaction =>
                <tr key={transaction.date}>
                    <td>{transaction.date}</td>
                    <td>{transaction.description}</td>
                    <td>{transaction.type}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.balance}</td>
                    <td>{transaction.isPosted ? "Posted" : "Pending"}</td>
                </tr>
            )}
            </tbody>
        </table>;

    return (
        <div>
            <h1 id="tableLabel">Financial Transactions</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents}
        </div>
    );

    async function populateTransactionData() {
        const response = await fetch('/transactions');
        const data = await response.json();
        setTransactions(data);
    }
}

export default App;