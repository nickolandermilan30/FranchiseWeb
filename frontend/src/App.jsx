import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/Home/LandingPage.jsx';
import Mainpage from './Pages/Home/Mainpage.jsx'; // Siguraduhin na tama ang path nito

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Default route: Dito magsisimula ang Admin para sa Login/Register */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Dashboard route: Dito pupunta ang Admin pagkatapos ng matagumpay na login */}
        <Route path="/mainpage" element={<Mainpage />} />

        {/* Catch-all route: Pabalik sa login kung mali ang URL */}
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Router>
  );
};

export default App;