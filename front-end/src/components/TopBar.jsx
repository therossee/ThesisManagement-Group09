import { useState } from "react";
import { Avatar, Badge, Button, Form, Input, Layout, notification } from "antd";
import { UserOutlined, BellOutlined, KeyOutlined, LogoutOutlined } from '@ant-design/icons';
import { useAuth } from '../App';
import '../css/style.css';

const { Header } = Layout;


function TopBar() {
  return (
    <Header className="header-style">
      <UserTopBar />
    </Header >
  )
}

function UserTopBar() {

  const { loggedIn } = useAuth();

  return (
    <>
      {loggedIn ? <LoggedInForm /> : <LoginForm />}
    </>
  );
}

function LoginForm() {

  const { doLogIn } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');


  const handleSubmit = async (event) => {
    event.preventDefault();

    const credentials = { username, password };
    try {
      await doLogIn(credentials);
      // Code to execute on successful login
    } catch (err) {
      console.log(err); // Handle login error
    }
  }


  return (
    <Form layout="inline" style={{ marginTop: "15px" }}>
      <Form.Item>
        <Input
          prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          type="email"
          placeholder="Email"
          value={username} onChange={ev => setUsername(ev.target.value)}
        />
      </Form.Item>
      <Form.Item>
        <Input
          prefix={<KeyOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
          type="password"
          placeholder="Password"
          value={password} onChange={ev => setPassword(ev.target.value)}
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={handleSubmit}>
          Log in
        </Button>
      </Form.Item>
    </Form>
  )
}

function LoggedInForm() {

  const { doLogOut } = useAuth();

  return (
    <div className="user-topbar-style">
      <Badge count={1} style={{ marginRight: '22px' }}>
        <BellOutlined style={{ fontSize: '24px', marginRight: '22px', verticalAlign: 'middle' }} />
      </Badge>
      <Avatar size="large" style={{ backgroundColor: '#1677ff', marginRight: '30px', verticalAlign: 'middle' }}>
        <UserOutlined />
      </Avatar>
      <Button type="secondary" icon={<LogoutOutlined style={{ fontSize: '20px', verticalAlign: 'middle' }} />} onClick={doLogOut} />
    </div>
  )
}

export default TopBar;