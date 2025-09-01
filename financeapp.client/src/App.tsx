import { useEffect, useState } from 'react';
import Plot  from 'react-plotly.js';
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

    const [transactions, setTransactions] = useState<Transaction[]>();

    useEffect(() => {
        populateTransactionData();
    }, []);

    async function populateTransactionData() {
        const response = await fetch('/transaction');
        const data = await response.json();
        setTransactions(data);
    }

    function sliceTransactions(transactions: Transaction[], key: keyof Transaction): Plotly.Datum[] {
        let values = []
        for (let i = 0; i < transactions.length; i++) {
            values.push(transactions[i][key]);
        }
        return values as Plotly.Datum[];
    }

    const content = transactions === undefined
    ? <p><em>Loading...</em></p>
    :<div id="content">
        <Plot
            data={[
                {
                    type: 'bar',
                    name: 'Balance',
                    x: sliceTransactions(transactions, "date"),
                    y: sliceTransactions(transactions, "balance"),
                    marker: {
                        color: 'rgb(55, 83, 109)'
                    }
                },
                {
                    type: 'bar',
                    name: 'Amount',
                    x: sliceTransactions(transactions, "date"),
                    y: sliceTransactions(transactions, "amount"),
                    marker: {
                        color: 'rgb(26, 118, 255)',
                    }
                }
            ]}
            layout={{
                width: 1000, 
                height: 750,
                xaxis: {
                    title: {
                        text: 'Date',
                        font: {
                            size: 16,
                            color: 'rgb(0,0,0)'
                        }
                    },
                    tickfont: {
                        size: 14,
                        color: 'rgb(0,0,0)'
                    }
                },
                yaxis: {
                    tickfont: {
                        size: 14,
                        color: 'rgb(0,0,0)'
                    },
                    tickprefix: "$"
                },
                legend: {
                    x: 1.0,
                    y: 1.0,
                    bgcolor: 'rgba(255, 255, 255, 0)',
                    bordercolor: 'rgba(255, 255, 255, 0)'
                },
                barmode: 'group',
                bargap: 0.15,
                bargroupgap: 0.1,
            }}
            />
        </div>
    return (content);
}

export default App;