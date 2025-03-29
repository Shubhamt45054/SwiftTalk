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

    // to avoid cold start
    useEffect(() => {
      if (process.env.NODE_ENV === "production") {
        const backendUrl = "/health";
  
        const interval = setInterval(async () => {
          try {
            console.log(`Pinging backend at ${backendUrl}`);
            await axiosInstance.get(backendUrl);
            console.log("Backend is warm!");
          } catch (err) {
            console.error("Error pinging backend:", err.message);
          }
        }, 300000); // 300,000 ms = 5 minutes
  
        // Cleanup interval on component unmount
        return () => clearInterval(interval);
      }
    }, []);


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