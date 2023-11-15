import { useState, useEffect, createContext, useContext } from 'react';
import { notification } from 'antd';
import MainLayout from './MainLayout';
import API from './API';
import './css/App.css'

// Context for handling user info and user-related functions
const AuthContext = createContext();

// Hook for using AuthContext
// Hook usage: const { user, loginLoading, isLoggedIn, isTeacher, doLogIn, doLogOut } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}

function App() {

  const [user, setUser] = useState(undefined);

  // Keep track in the client if user is isLoggedIn or not
  // Could also use instead user === undefined but isLoggedIn is used for better comprehension
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);

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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Here we have the user info, if already logged in
        const user = await API.getUserInfo();
        setIsLoggedIn(true);
        setUser(user);
        if (user.id.startsWith("d"))
          setIsTeacher(true);
      } catch (err) {
        // NO need to do anything: user is simply not yet authenticated
      }
    };
    checkAuth();
  }, []);

  const loginSuccessful = (user) => {
    setUser(user);
    setIsLoggedIn(true);
    if (user.id.startsWith("d"))
      setIsTeacher(true);
  }

  const doLogIn = (credentials) => {
    setLoginLoading(true);
    API.logIn(credentials)
      .then(user => {
        loginSuccessful(user);
      })
      .catch(err => {
        // NB: should not give additional info (e.g., if user exists etc.)
        openNotification(err.message ? err.message : err);
        setLoginLoading(false);
      })
  }

  const doLogOut = async () => {
    await API.logOut();
    setIsLoggedIn(false);
    setIsTeacher(false);
    setUser(undefined);
    setLoginLoading(false);
  }

  return (
    <AuthContext.Provider value={{ user, loginLoading, isLoggedIn, isTeacher, doLogIn, doLogOut }}>
      {notificationBox}
      <MainLayout />
    </AuthContext.Provider>
  )
}

export default App
