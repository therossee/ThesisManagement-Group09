import React from "react";
import { Button } from 'antd';
import { useAuth } from './useAuth';
import { LogoutOutlined } from '@ant-design/icons';
const LogoutButton = () => {

    const { logout } = useAuth();

    return (
        <Button type="link" icon={<LogoutOutlined />} onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Log Out
        </Button>
    );
};

export default LogoutButton;