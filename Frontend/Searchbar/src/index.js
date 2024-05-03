import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Header from './Components/Header/Header';
import SearchBar from './Components/SearchBar/SearchBar';
import Main from './Components/Main/Main';
import CreateTest from './Components/CreateTest/CreateTest';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <Header/>
    <SearchBar/>
    <CreateTest/>
    <Main/>
  </>
);
