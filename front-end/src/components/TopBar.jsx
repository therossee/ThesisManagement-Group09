import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Badge, Button, Form, Input, Layout } from "antd";
import { UserOutlined, BellOutlined, FileAddOutlined, KeyOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../components/authentication/useAuth';
import LoginButton from './authentication/LoginButton';
import LogoutButton from './authentication/LogoutButton';
import '../css/style.css';

const { Header } = Layout;

function TopBar() {

  const { isAuthenticated } = useAuth();

  return (
    <>
      <div className="cover-style" />
      <Header className="header-style">
        {isAuthenticated ?
          <IsLoggedInForm />
          :
          <LoginButton />
        }
      </Header >
    </>
  )
}

function IsLoggedInForm() {

  const { isTeacher } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      {
        isTeacher &&
        <FileAddOutlined style={{ fontSize: '22px', verticalAlign: 'middle', marginRight: "20px" }} onClick={() => navigate("/insert-proposal")} />
      }
      <Badge count={1} style={{ marginRight: '22px' }}>
        <BellOutlined style={{ fontSize: '22px', marginRight: '22px', verticalAlign: 'middle' }} />
      </Badge>
      <Avatar size="large" style={{ backgroundColor: '#1677ff', marginRight: '30px', verticalAlign: 'middle' }}>
        <UserOutlined />
      </Avatar>
      <LogoutButton />
    </div>
  )
}

export default TopBar;