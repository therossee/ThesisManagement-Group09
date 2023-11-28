import { useState, useEffect, createContext, useContext } from 'react';
import { notification } from 'antd';
import MainLayout from './MainLayout';
import API from './API';
import './css/App.css';
import { useAuth0 } from '@auth0/auth0-react';

function App() {

  const {user, isAuthenticated, getAccessTokenSilently, isLoading, loginWithRedirect} = useAuth0();
  const [isTeacher, setIsTeacher] = useState(false);
  const [isStudent, setIsStudent] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [userData, setUserData] = useState(null);
  const [dirty, setDirty] = useState(false);
  
  const [loginLoading, setLoginLoading ] = useState(false);

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
		const getUserData = async () => {
			try {
				setLoginLoading(true);
				const accessToken = await getAccessTokenSilently({
					authorizationParams: {
						audience: `https://thesis-management-09.eu.auth0.com/api/v2/`,
						scope: 'read:current_user',
					},
				});
				setAccessToken(accessToken);
				API.getUserInfo(accessToken)
					.then((user) => {
						setUserData(user);
						if (user && user.role === 'student') {
							setIsTeacher(false);
							setIsStudent(true);
						} else if (user && user.role === 'teacher') {
							setIsTeacher(true);
							setIsStudent(false);
						}
					})
					.catch((err) => openNotification(err));
			} catch (e) {
        openNotification(e.message);
			}
		};
		if (isAuthenticated) {
			getUserData();
			setDirty(false);
		}
	}, [isAuthenticated, getAccessTokenSilently, user?.sub, dirty, setLoginLoading]);


  return (
    <>
      {notificationBox}
      <MainLayout userData={userData} isTeacher={isTeacher} isAuthenticated={isAuthenticated} accessToken={accessToken}/>
    </>
  )
}

export default App
