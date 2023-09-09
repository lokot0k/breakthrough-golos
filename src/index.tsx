import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Constructor} from "./Constructor";
import {Poll, loader as pollLoader} from "./Poll";
import 'bootstrap/dist/css/bootstrap.min.css';
import {AdminPoll, loader as adminPollLoader} from "./AdminPoll";
import {ArcElement} from "chart.js";
import 'chart.js/auto';
import {Test} from "./Test";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>
    },
    {
        path: "/new",
        element: <Constructor/>
    },
    {
        path: "/poll/:pollId",
        element: <Poll/>,
        loader: pollLoader
    },
    {
        path: "/poll/admin/:pollId",
        element: <AdminPoll/>,
        loader: adminPollLoader
    },
    {
        path: "/test/:pollId",
        element: <Test/>,
    }
])

// Chart.register(ArcElement)

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
