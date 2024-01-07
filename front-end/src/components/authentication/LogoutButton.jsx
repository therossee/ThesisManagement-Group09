import React from "react";
import { Button } from 'antd';
import { useAuth } from './useAuth';
import { LogoutOutlined } from '@ant-design/icons';
const LogoutButton = () => {

    const { handleLogout } = useAuth();

    return (
        <Button ghost type="primary" style={{ marginTop: "17px" }} onClick={handleLogout}>
            <LogoutOutlined />
            Log Out
        </Button>
    );
};

export default LogoutButton;