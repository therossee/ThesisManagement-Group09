import React from 'react';
import { Button } from 'antd';
import { useAuth } from './useAuth';

// Functional component with a login button
const LoginButton = () => {
    const { loginWithRedirect } = useAuth();

    return (
        <Button ghost type="primary" onClick={() => loginWithRedirect()} style={{ marginTop: "17px" }}>
            Log in
        </Button>
    );
};

export default LoginButton;