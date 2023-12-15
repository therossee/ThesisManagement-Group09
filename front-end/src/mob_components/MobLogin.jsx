import React from 'react';
import { LoginOutlined } from '@ant-design/icons';
import { useAuth } from '../components/authentication/useAuth';

// Functional component with a login button
const MobLogin = () => {
    const { handleLogin } = useAuth();

    return (
        <LoginOutlined onClick={() => handleLogin()}/>
    );
};

export default MobLogin;