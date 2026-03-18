import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import ForgotPassword from './pages/Login/ForgotPassword';
import Dashboard from './pages/Dashboard/Dashboard';
import Notifications from './pages/Notifications/Notifications';
import Settings from './pages/Settings/Settings';
import Profile from './pages/Profile/Profile';
import SchemesList from './pages/SchemesList/SchemesList';
import SchemeDetails from './pages/SchemeDetails/SchemeDetails';
import OfficialPortals from './pages/OfficialPortals/OfficialPortals';
import HelpSupport from './pages/HelpSupport/HelpSupport';
import About from './pages/About/About';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/notifications" 
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />
        <Route path="/schemes" element={<SchemesList />} />
        <Route path="/scheme/:id" element={<SchemeDetails />} />
        <Route path="/portals" element={<OfficialPortals />} />
        <Route path="/support" element={<HelpSupport />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Layout>
  );
}
