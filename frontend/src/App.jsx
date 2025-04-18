import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx'

import HomePage from './pages/HomePage.jsx';
import SignUpPage from './pages/SignUpPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SettingsPage from './pages/SettingPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

import { useAuthStore } from "./store/useAuthStore.js";
import useThemeStore from './store/useThemeStore.js';
import {Loader} from "lucide-react";
import { Navigate } from 'react-router';
import { Toaster } from 'react-hot-toast';
import ErrorBoundary from './utils/ErrorBoundarirs.jsx';
import { axiosInstance } from "./utils/axios.js";

const App = () => {

  const {authUser, isCheckingAuth,checkAuth,onlineUsers} = useAuthStore();
  const {theme, setTheme} = useThemeStore();

  useEffect(()=>{
    checkAuth();
  },[checkAuth]);


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

      <Navbar/>
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