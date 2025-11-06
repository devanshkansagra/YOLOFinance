import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Auth/Login";
import SignUp from "./components/Auth/SignUp";
import Dashboard from "./components/Dashboard/Dashboard";
import MarketingPage from "./components/Home/MarketingPage";
import MutualFunds from "./components/Dashboard/MutualFunds";
import Insurance from "./components/Dashboard/Insurance";
import NewsLetter from "./components/Home/NewsLetter";
import Chatbot from "./components/Common/ChatBot";
import {
  PaymentPage,
  InsurancePaymentPage,
} from "./components/Dashboard/components/PaymentPage";
import Profile from "./components/Auth/Profile";
// import GoalDashboard from "./components/Dashboard/GoalDashboard";
import SWPDashboard from "./components/Dashboard/SWPDashboard";
import ReportsDashboard from "./components/Dashboard/ReportsDashboard";
import CalcDashboard from "./components/Dashboard/CalcDashboard";
// import Feedback from "./components/Dashboard/Feedback";
import AboutDashboard from "./components/Dashboard/AboutDashboard";
import FeedbackDashboard from "./components/Dashboard/FeedbackDashboard";
import { PrivateRoute } from "./PrivateRoutes";
import NotFound from "./NotFound";
import GovBondsDashboard from "./components/Dashboard/GovBondsDashboard";
import GovBonds from "./components/Dashboard/GovBonds";
import SuccessPage from "./components/Home/SuccessPage";

const App = () => (
  <Router>
    <div className="relative min-h-screen">
      <Routes>
        <Route path="/" element={<MarketingPage />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Signup" element={<SignUp />} />
        <Route
          path="/Dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/MutualFunds"
          element={
            <PrivateRoute>
              <MutualFunds />
            </PrivateRoute>
          }
        />
        <Route
          path="/CalcDashboard"
          element={
            <PrivateRoute>
              <CalcDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/GovBonds"
          element={
            <PrivateRoute>
              <GovBonds />
            </PrivateRoute>
          }
        />
        <Route
          path="/Insurance"
          element={
            <PrivateRoute>
              <Insurance />
            </PrivateRoute>
          }
        />
        <Route
          path="/SWPDashboard"
          element={
            <PrivateRoute>
              <SWPDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/ReportsDashboard"
          element={
            <PrivateRoute>
              <ReportsDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/NewsLetter"
          element={
            <PrivateRoute>
              <NewsLetter />
            </PrivateRoute>
          }
        />
        <Route
          path="/payment"
          element={
            <PrivateRoute>
              <PaymentPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/insurance-payment"
          element={
            <PrivateRoute>
              <InsurancePaymentPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />
        <Route
          path="/about"
          element={
            <PrivateRoute>
              <AboutDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/feedback"
          element={
            <PrivateRoute>
              <FeedbackDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Chatbot />
    </div>
  </Router>
);

export default App;
