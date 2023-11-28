import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Badge, Button, Form, Input, Layout } from "antd";
import { UserOutlined, BellOutlined, FileAddOutlined, KeyOutlined, LogoutOutlined } from '@ant-design/icons';
import LoginButton from './authentication/LoginButton';
import LogoutButton from './authentication/LogoutButton';
import { BrowserRouter as Router, Route } from "react-router-dom";
import '../css/style.css';

const { Header } = Layout;

function TopBar(props) {

  const navigate = useNavigate();

  return (
    <>
      <div className="cover-style" />
      <Header className="header-style">
            <header>
              <nav>
                {!props.isAuthenticated ? (
                  <div>
                    <LoginButton/>
                  </div>
                ) : (
                  <div>
                      { props.isTeacher &&
                          <FileAddOutlined style={{ fontSize: '22px', verticalAlign: 'middle', marginRight: "20px" }} onClick={() => navigate("/insert-proposal")} />
                      }
                      <Badge count={1} style={{ marginRight: '22px' }}>
                        <BellOutlined style={{ fontSize: '22px', marginRight: '22px', verticalAlign: 'middle' }} />
                      </Badge>
                     
                    <LogoutButton>
                      <Avatar size="large" style={{ backgroundColor: '#1677ff', marginRight: '30px', verticalAlign: 'middle' }}>
                        <UserOutlined />
                      </Avatar>
                    </LogoutButton>
                  </div>
                )}
              </nav>
            </header>
      </Header >
    </>
  )
}


export default TopBar;