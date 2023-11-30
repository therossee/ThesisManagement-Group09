import { useEffect } from 'react';
import { notification } from 'antd';
import MainLayout from './MainLayout';
import API from './API';
import { useAuth } from './components/authentication/useAuth';
import './css/App.css'

function App() {

  const { setUserData, isAuthenticated, setIsTeacher, getAccessTokenSilently, setAccessToken, accessToken } = useAuth();

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
    const fetch = async () => {
      try {
        const token = await getAccessTokenSilently({
          authorizationParams: {
            audience: 'https://thesis-management-09.eu.auth0.com/api/v2/',
            scope: 'read:current_user',
          },
        });
        setAccessToken(token);
        const user = await API.getUserInfo(token);
        setIsTeacher(user.role === 'teacher');
        setUserData(user);
      } catch (err) {
        openNotification(err.message || err);
      }
    };

    if (isAuthenticated) {
      fetch();
    }
  }, [isAuthenticated, accessToken ]);

  return (
    <>
      {notificationBox}
      <MainLayout />
    </>
  )
}

export default App
