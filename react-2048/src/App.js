import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import Game from './Game';


function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/game" element={<Game />} />

      </Routes>
    </Router>
  );
}

export default App;
