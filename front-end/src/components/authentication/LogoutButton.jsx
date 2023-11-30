import React from "react";
import { Button } from 'antd';
import { useAuth } from './useAuth';
const LogoutButton = () => {

    const { logout } = useAuth();

    return (
        <Button ghost type="primary" style={{ marginTop: "17px" }} onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
            Log Out
        </Button>
    );
};

export default LogoutButton;