import { useNavigate } from "react-router-dom";
import { Layout, Avatar } from "antd";
import { FileAddOutlined, UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useAuth } from '../components/authentication/useAuth';
import LoginButton from './authentication/LoginButton';
import LogoutButton from './authentication/LogoutButton';
import '../css/style.css';

const { Header } = Layout;

function TopBar({ collapsed, setCollapsed }) {

  const { isAuthenticated } = useAuth();

  return (
    <>
      <div className="cover-style" />
      <Header className="header-style">
        {isAuthenticated ?
          <IsLoggedInForm collapsed={collapsed} setCollapsed={setCollapsed} />
          :
          <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
            <LoginButton />
          </div>
        }
      </Header >
    </>
  )
}

function IsLoggedInForm({ collapsed, setCollapsed }) {
  const { isTeacher, userData } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {collapsed ?
          <MenuUnfoldOutlined
            style={{ fontSize: '26px', verticalAlign: 'middle', marginRight: '20px' }}
            onClick={() => setCollapsed(!collapsed)}
          />
          :
          <MenuFoldOutlined style={{ fontSize: '26px', verticalAlign: 'middle', marginRight: '20px' }}
            onClick={() => setCollapsed(!collapsed)} />
        }
        <Avatar size="large" style={{ backgroundColor: '#1677ff', marginRight: "10px" }} icon={<UserOutlined />} />
        <span>{userData.name}</span>
      </div>
      <div>
        {isTeacher && (
          <FileAddOutlined
            style={{ fontSize: '26px', verticalAlign: 'middle', marginRight: '20px' }}
            onClick={() => navigate('/insert-proposal')}
          />
        )}
        <LogoutButton />
      </div>
    </div>
  );
}


export default TopBar;