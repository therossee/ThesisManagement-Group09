import React from "react";
import { Button } from 'antd';
import { useAuth } from './useAuth';
const LogoutButton = () => {

    const { handleLogout } = useAuth();

    return (
        <Button ghost type="primary" style={{ marginTop: "17px" }} onClick={handleLogout}>
            Log Out
        </Button>
    );
};

export default LogoutButton;