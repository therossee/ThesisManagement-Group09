import React from 'react';
import { Button } from 'antd';
import { useAuth } from './useAuth';
import { UserOutlined } from '@ant-design/icons';

// Functional component with a login button
const LoginButton = () => {
    const { handleLogin } = useAuth();

    return (
        <Button ghost type="primary" onClick={() => handleLogin()} style={{ marginTop: "17px" }}>
            <UserOutlined />
            Log in
        </Button>
    );
};

export default LoginButton;