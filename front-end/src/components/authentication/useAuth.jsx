import { useState, createContext, useContext, useEffect } from 'react';
import API  from '../../API.jsx';

// Context for handling user info and user-related functions
const AuthContext = createContext();

// Hook for using AuthContext
export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {

    // Keep track in the client if user is Teacher or not
    const [isTeacher, setIsTeacher] = useState(undefined);

    const [userData, setUserData] = useState(null);

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const handleLogin = () => {
        API.redirectToLogin();
    };
    
    const handleLogout = () => {
        API.logOut();
    };

    // Check if someone is authenticated
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await API.getUser();
                setIsTeacher(user.roles.includes("teacher"));
                setUserData(user);
                setIsAuthenticated(true);
            } catch (err) {
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ isAuthenticated, userData, handleLogin, handleLogout, isTeacher, isTeacher}}>
            {children}
        </AuthContext.Provider>
    );
}