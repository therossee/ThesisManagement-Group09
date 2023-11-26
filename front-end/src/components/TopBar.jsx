import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Badge, Button, Form, Input, Layout } from "antd";
import { UserOutlined, BellOutlined, FileAddOutlined, KeyOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from './authentication/LoginButton';
import LogoutButton from './authentication/LogoutButton';
import User from './authentication/User';
import { BrowserRouter as Router, Route } from "react-router-dom";
import '../css/style.css';

const { Header } = Layout;

function TopBar() {

  const { user, isAuthenticated, isLoading } = useAuth0();

  return (
    <>
      <div className="cover-style" />
      <Header className="header-style">
            <header>
              <nav>
                {!isAuthenticated ? (
                  <div>
                    <LoginButton/>
                  </div>
                ) : (
                  <div>
                    <User user = {user} />
                    <LogoutButton/>
                  </div>
                )}
              </nav>
            </header>
      </Header >
    </>
  )
}


export default TopBar;