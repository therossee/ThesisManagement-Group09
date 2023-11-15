import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, Badge, Button, Form, Input, Layout } from "antd";
import { UserOutlined, BellOutlined, KeyOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../App';
import '../css/style.css';

const { Header } = Layout;

function TopBar() {
  return (
    <>
      <div className="cover-style" />
      <Header className="header-style">
        <UserTopBar />
      </Header >
    </>
  )
}

function UserTopBar() {

  const { isLoggedIn } = useAuth();

  return (
    <>
      {isLoggedIn ? <IsLoggedInForm /> : <LoginForm />}
    </>
  );
}

function LoginForm() {

  const { doLogIn, loginLoading } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit = (event) => {
    event.preventDefault();

    const credentials = { username, password };
    doLogIn(credentials); // err catching handlend directly in App.jsx
  }


  return (
    <Form layout="inline" style={{ marginTop: "15px" }}>
      <Form.Item>
        <Input
          disabled={loginLoading}
          prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          type="email"
          placeholder="Email" onChange={ev => setUsername(ev.target.value)}
        />
      </Form.Item>
      <Form.Item>
        <Input
          disabled={loginLoading}
          prefix={<KeyOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          type="password"
          placeholder="Password" onChange={ev => setPassword(ev.target.value)}
        />
      </Form.Item>
      <Form.Item>
        <Button ghost type="primary" htmlType="submit" onClick={handleSubmit} loading={loginLoading}>
          Log in
        </Button>
      </Form.Item>
    </Form>
  )
}

function IsLoggedInForm() {

  const { isTeacher, doLogOut } = useAuth();
  const navigate = useNavigate();

  const logOutAndNavigate = () => {
    doLogOut();
    navigate("/");
  }

  return (
    <div>
      {
        isTeacher &&
        <Button ghost type="primary" style={{marginRight: "20px"}} onClick={() => navigate("/insert-proposal")}>Add Proposal</Button>
      }
      <Badge count={1} style={{ marginRight: '22px' }}>
        <BellOutlined style={{ fontSize: '24px', marginRight: '22px', verticalAlign: 'middle' }} />
      </Badge>
      <Avatar size="large" style={{ backgroundColor: '#1677ff', marginRight: '30px', verticalAlign: 'middle' }}>
        <UserOutlined />
      </Avatar>
      <LogoutOutlined style={{ fontSize: '20px', verticalAlign: 'middle' }} onClick={logOutAndNavigate}/>
    </div>
  )
}

export default TopBar;