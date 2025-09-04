import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import Dashboard from './components/Dashboard/Dashboard';
import MarketingPage from './components/Home/MarketingPage';
import MutualFundDashboard from './components/Dashboard/MutualFundDashboard';
import MutualFunds from './components/Dashboard/MutualFunds';
import SipCalculator from './components/Home/SipCalculator';
import GoalTracker from './components/Dashboard/GoalTracker';
import NewsLetter from './components/Home/NewsLetter';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<MarketingPage />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/Signup" element={<SignUp />} />
      <Route path="/Dashboard" element={<Dashboard />} />
      <Route path='/MutualFunds' element={<MutualFunds />}></Route>
      <Route path="/SipCalculator" element={<SipCalculator />} />
      <Route path="/GoalTracker" element={<GoalTracker />} />
      <Route path="/NewsLetter" element={<NewsLetter />} />
    </Routes>
  </Router>
);

export default App;
