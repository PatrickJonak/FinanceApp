import { useEffect, useState } from 'react';
import './App.css';

interface Forecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary: string;
}

function App() {
    console.log(import.meta.env.VITE_TARGET);
    
    const [forecasts, setForecasts] = useState<Forecast[]>();
    
    useEffect(() => {
        populateWeatherData();
    }, []);

    const contents = forecasts === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        : <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Temp. (C)</th>
                    <th>Temp. (F)</th>
                    <th>Summary</th>
                </tr>
            </thead>
            <tbody>
                {forecasts.map(forecast =>
                    <tr key={forecast.date}>
                        <td>{forecast.date}</td>
                        <td>{forecast.temperatureC}</td>
                        <td>{forecast.temperatureF}</td>
                        <td>{forecast.summary}</td>
                    </tr>
                )}
            </tbody>
        </table>;

    return (
        <div>
            <h1 id="tableLabel">Weather forecast</h1>
            <p>This component demonstrates fetching data from the server.</p>
            {contents}
        </div>
    );

    async function populateWeatherData() {
        const response = await fetch('weatherforecast');
        console.log(response);
        const data = await response.json();
        setForecasts(data);
    }
}

// interface Todo {
//     id: number;
//     title: string;
//     dueBy: string;
//     isComplete: boolean;
// }
//
// function App() {
//     const [todos, setTodos] = useState<Todo[]>();
//
//     useEffect(() => {
//         populateTodoData();
//     }, []);
//
//     const contents = todos === undefined
//         ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
//         : <table className="table table-striped" aria-labelledby="tableLabel">
//             <thead>
//             <tr>
//                 <th>ID</th>
//                 <th>Title</th>
//                 <th>Due Date</th>
//                 <th>Completed?</th>
//             </tr>
//             </thead>
//             <tbody>
//             {todos.map(todo =>
//                 <tr key={todo.id}>
//                     <td>{todo.id}</td>
//                     <td>{todo.title}</td>
//                     <td>{todo.dueBy}</td>
//                     <td>{todo.isComplete}</td>
//                 </tr>
//             )}
//             </tbody>
//         </table>;
//
//     return (
//         <div>
//             <h1 id="tableLabel">To Do List</h1>
//             <p>This component demonstrates fetching data from the server.</p>
//             {contents}
//         </div>
//     );
//
//      async function populateTodoData() {
//          const response = await fetch('todos');
//          const data = await response.json();
//          setTodos(data);
//      }
// }

export default App;