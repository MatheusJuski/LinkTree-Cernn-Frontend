import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';



import { AuthProvider } from './contexts/AuthContext.tsx'; 


import ProtectedRoute from './components/ProtectedRoute.tsx'; 


import LoginPage from './LoginPage.tsx';


import LinkTree from './LinkTree.tsx';

import AdminPanel from './AdminPanel.js'; 

function App() {
  return (

    <AuthProvider> 
      <Router>
        <div className="App">
          <Routes>
            

            <Route path="/" element={<LinkTree />} />
 
            <Route path="/login" element={<LoginPage />} />


            <Route 
              path="/admin" 
              element={<ProtectedRoute element={<AdminPanel />} />} 
            />

            <Route path="/logout" element={<LoginPage />} />

          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;