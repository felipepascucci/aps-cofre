import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CamPage from './CamPage';
import RegistrationPage from './RegistrationPage';
import Level1Page from './Level1Page';
import Level2Page from './Level2Page';
import Level3Page from './Level3Page';
import ProtectedRoute from './ProtectedRoute';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CamPage />} />
        <Route path="/cadastro" element={<RegistrationPage />} />

        <Route 
          path="/nivel-1" 
          element={
            <ProtectedRoute requiredLevel="Nível 1 - Geral">
              <Level1Page />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/nivel-2" 
          element={
            <ProtectedRoute requiredLevel="Nível 2 - Diretor">
              <Level2Page />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/nivel-3" 
          element={
            <ProtectedRoute requiredLevel="Nível 3 - Ministro">
              <Level3Page />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;