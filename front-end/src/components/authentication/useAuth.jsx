import { useState, createContext, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

// Context for handling user info and user-related functions
const AuthContext = createContext();

// Hook for using AuthContext
export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {

    const {isAuthenticated, getAccessTokenSilently, isLoading, loginWithRedirect, logout } = useAuth0();

    // Keep track in the client if user is Teacher or not
    const [isTeacher, setIsTeacher] = useState(undefined);

    const [accessToken, setAccessToken] = useState(null);

    const [userData, setUserData] = useState(null);

    return (
        <AuthContext.Provider value={{ userData, setUserData, isAuthenticated, getAccessTokenSilently, isLoading, loginWithRedirect, isTeacher, setIsTeacher, accessToken, setAccessToken, logout }}>
            {children}
        </AuthContext.Provider>
    );
}