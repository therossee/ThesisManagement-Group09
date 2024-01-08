import { useNavigate } from "react-router-dom";
import { Badge, Layout, Avatar } from "antd";
import { BellOutlined, FileAddOutlined, UserOutlined } from '@ant-design/icons';
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
          <div style={{ display: 'flex', justifyContent: 'end', alignItems: 'center' }}>
            <LoginButton />
          </div>
        }
      </Header >
    </>
  )
}

function IsLoggedInForm() {

  const { isTeacher, userData } = useAuth();
  const navigate = useNavigate();

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Avatar size="large" style={{ backgroundColor: '#1677ff', marginRight: "10px" }} icon={<UserOutlined />} />
        <span>{userData.name}</span>
      </div>
      <div>
        {isTeacher && (
          <FileAddOutlined
            style={{ fontSize: '22px', verticalAlign: 'middle', marginRight: '20px' }}
            onClick={() => navigate('/insert-proposal')}
          />
        )}
        <Badge count={1} style={{ marginRight: '22px' }}>
          <BellOutlined style={{ fontSize: '22px', marginRight: '22px', verticalAlign: 'middle' }} />
        </Badge>
        <LogoutButton />
      </div>
    </div>
  );
}


export default TopBar;