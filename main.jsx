import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import AdminDashboard from './pages/AdminDashboard'
import SalesmanView from './pages/SalesmanView'
import Login from './pages/Login'
import { supabase } from './lib/supabaseClient'

import './styles.css'

function Protected({children}){
  const user = supabase.auth.getSession ? null : null; // placeholder for SSR safety
  // client-side: we will check session inside AdminDashboard/Login flows
  return children;
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/admin' element={<AdminDashboard/>} />
        <Route path='/salesman' element={<SalesmanView/>} />
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)
