import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './assets/LandingPage';
import AuthPage from './assets/AuthPage';
import ChatPage from './assets/Chatpage';

// Ek helper component jo check karega ki user logged in hai ya nahi
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  // Agar token hai to ChatPage dikhao, warna AuthPage par bhej do
  return token ? children : <Navigate to="/auth" />;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/chat"
        element={
          <PrivateRoute>
            <ChatPage />
          </PrivateRoute>
        }
      />
      {/* Agar koi aur route match na ho to landing page par bhej do */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;