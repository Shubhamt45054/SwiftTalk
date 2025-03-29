import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom';
import Navabar from './src/components/Navabar.jsx'

import HomePage from './src/pages/HomePage.jsx';
import SignUpPage from './src/pages/SignUpPage.jsx';
import LoginPage from './src/pages/LoginPage.jsx';
import SettingsPage from './src/pages/SettingPage.jsx';
import ProfilePage from './src/pages/ProfilePage.jsx';

import { useAuthStore } from './src/store/useAuthStore.js';
import useThemeStore from './src/store/useThemeStore.js';
import {Loader} from "lucide-react";
import { Navigate } from 'react-router';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './src/utils/ErrorBoundarirs.jsx';

const App = () => {

  const {authUser, isCheckingAuth,checkAuth,onlineUsers} = useAuthStore();
  const {theme, setTheme} = useThemeStore();

  console.log("Users");
  console.log({onlineUsers});

  useEffect(()=>{
    checkAuth();
  },[checkAuth]);
  
  console.log({authUser});

  if(isCheckingAuth && !authUser){
    return (
      <div className="flex items-center justify-center h-screen">
      <Loader className="size-10 animate-spin" />
    </div>
    )
  }

  return (
    <div data-theme={theme} >
      <ErrorBoundary>

      <Navabar/>
      <Routes>
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to="/login" />} />
      </Routes>
      <Toaster/>

      </ErrorBoundary>
    </div>
  )
}

export default App;
