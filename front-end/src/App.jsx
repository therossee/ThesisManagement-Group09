import { useEffect } from 'react';
import { notification } from 'antd';
import MainLayout from './MainLayout';
import API from './API';
import { useAuth } from './components/authentication/useAuth';
import './css/App.css'

function App() {

  const { setUserData, isAuthenticated, setIsTeacher } = useAuth();

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
    <>
      {notificationBox}
      <MainLayout />
    </>
  )
}

export default App
