import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {BrowserRouter} from "react-router-dom"
import  ShopProvider  from "./ShopContext"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
  <ShopProvider>
    <App />
  </ShopProvider>
  </BrowserRouter>
);


