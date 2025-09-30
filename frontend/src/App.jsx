import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './assets/LandingPage';
import AuthPage from './assets/AuthPage';
import ChatPage from './assets/Chatpage';


const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');

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
     
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;