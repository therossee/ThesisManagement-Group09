import { useState, createContext, useContext, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
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
    const [isTester, setIsTester] = useState(false);

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
                setIsTester(user.roles.includes("tester"));
                setUserData(user);
                setIsAuthenticated(true);
            } catch (err) {
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

     // Memorize the context value
     const contextValue = useMemo(() => ({
        isAuthenticated,
        userData,
        handleLogin,
        handleLogout,
        isTeacher,
        isTester
    }), [isAuthenticated, userData, handleLogin, handleLogout, isTeacher, isTester]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};