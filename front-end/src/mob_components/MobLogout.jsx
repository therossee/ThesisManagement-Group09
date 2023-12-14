import React from "react";
import { useAuth } from '../components/authentication/useAuth';
import { LogoutOutlined } from "@ant-design/icons";
const MobLogout = () => {

    const { handleLogout } = useAuth();

    return (
        <LogoutOutlined ghost type="primary" onClick={handleLogout} style={{fontSize: '18px'}}/>
    );
};

export default MobLogout;