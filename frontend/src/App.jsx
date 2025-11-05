import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import Teams from './pages/Teams';
import './App.css';

function App() {
  return (
    <div className="App">
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="text-xl font-bold">Volleyball Tournament Tracker</div>
            <div className="flex space-x-1 md:space-x-4">
              <a href="/" className="px-3 py-2 rounded hover:bg-blue-700 transition duration-300">Home</a>
              <a href="/teams" className="px-3 py-2 rounded hover:bg-blue-700 transition duration-300">Teams</a>
              <a href="/admin" className="px-3 py-2 rounded hover:bg-blue-700 transition duration-300">Admin</a>
              <a href="/#scheduled-matches" className="px-3 py-2 rounded hover:bg-blue-700 transition duration-300">Scheduled Matches</a>
              <a href="/#points-table" className="px-3 py-2 rounded hover:bg-blue-700 transition duration-300">Points Table</a>
            </div>
          </div>
        </div>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/teams" element={<Teams />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </div>
  );
}

export default App;