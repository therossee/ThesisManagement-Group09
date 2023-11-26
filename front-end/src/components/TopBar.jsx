import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Badge, Button, Form, Input, Layout } from "antd";
import { UserOutlined, BellOutlined, FileAddOutlined, KeyOutlined, LogoutOutlined } from '@ant-design/icons';
import { Auth0Provider } from '@auth0/auth0-react';
import LoginButton from './authentication/LoginButton';
import { BrowserRouter as Router, Route } from "react-router-dom";
import '../css/style.css';

const { Header } = Layout;

function TopBar() {
  return (
    <>
      <div className="cover-style" />
      <Header className="header-style">
          <Auth0Provider
            domain="thesis-management-09.eu.auth0.com"
            clientId="o5I1QNTABwbX6g1xc2lxota9aZQEsOvA"
            redirectUri={window.location.origin}
          >
            <header>
              <nav>
                  <LoginButton/>
              </nav>
            </header>
          </Auth0Provider>
      </Header >
    </>
  )
}


export default TopBar;