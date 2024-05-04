import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Header from './Components/Header/Header';
import Main from './Components/Main/Main';
import CreateTest from './Components/CreateTest/CreateTest';
import SearchResults from './Components/SearchResult/SearchResult';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Header/>
    <CreateTest/>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/search-results" element={<SearchResults />} />
    </Routes>

  </Router>
);