import { useState, useEffect, createContext, useContext } from 'react';
import { notification } from 'antd';
import MainLayout from './MainLayout';
import API from './API';
import './css/App.css'

// Context for handling user info and user-related functions
const AuthContext = createContext();

// Hook for using AuthContext
// Hook usage: const { user, loggedIn, doLogIn, doLogOut } = useAuth();
export function useAuth() {
  return useContext(AuthContext);
}

function App() {

  const [user, setUser] = useState(undefined);

  // Keep track in the client if user is loggedin or not
  // Could also use instead user === undefined but loggedIn is used for better comprehension
  const [loggedIn, setLoggedIn] = useState(false);
  const [api, notificationBox] = notification.useNotification();

  const openNotification = (err) => {
    api.error({
      message: "Error encountered!",
      description: err,
      placement: 'bottomRight',
      duration: 4,
    });
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Here we have the user info, if already logged in
        const user = await API.getUserInfo();
        setLoggedIn(true);
        setUser(user);
      } catch (err) {
        // NO need to do anything: user is simply not yet authenticated
      }
    };
    checkAuth();
  }, []);

  const loginSuccessful = (user) => {
    setUser(user);
    setLoggedIn(true);
  }

  const doLogIn = (credentials) => {
    API.logIn(credentials)
      .then(user => {
        loginSuccessful(user);
      })
      .catch(err => {
        // NB: should not give additional info (e.g., if user exists etc.)
        // NB2: err is plain text and not json obj!
        openNotification(err);
      })
  }

  const doLogOut = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(undefined);
  }

  return (
    <AuthContext.Provider value={{ user, loggedIn, doLogIn, doLogOut }}>
      {notificationBox}
      <MainLayout />
    </AuthContext.Provider>
  )
}

export default App
