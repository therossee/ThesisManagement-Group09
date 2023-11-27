import { useState, useEffect, createContext, useContext } from 'react';
import { notification } from 'antd';
import MainLayout from './MainLayout';
import API from './API';
import './css/App.css';
import { useAuth0 } from '@auth0/auth0-react';

// Context for handling user info and user-related functions
const AuthContext = createContext();

// Hook for using AuthContext
// Hook usage: const { user, loginLoading, isLoggedIn, isTeacher, doLogIn, doLogOut } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}

function App() {

  const {user, isAuthenticated, isLoading} = useAuth0();

  const [isTeacher, setIsTeacher] = useState( user?.nickname.startsWith("d") );
  const [isStudent, setIsStudent] = useState( user?.nickname.startsWith("s") );
  
  // Handle the login loading state
  const [loginLoading, setLoginLoading] = useState(false);

  // Handle notification box for api errors during login
  const [api, notificationBox] = notification.useNotification();

  function openNotification(text) {
    api.error({
      message: "Error encountered!",
      description: text,
      placement: 'bottomRight',
      duration: 4,
    });
  };

  return (
    <AuthContext.Provider value={{ user, loginLoading, isAuthenticated, isTeacher, isStudent }}>
      {notificationBox}
      <MainLayout />
    </AuthContext.Provider>
  )
}

export default App
