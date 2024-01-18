import { useNavigate } from "react-router-dom";
import { Layout, Avatar } from "antd";
import { FileAddOutlined, UserOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import { useAuth } from './authentication/useAuth';
import LoginButton from './authentication/LoginButton';
import LogoutButton from './authentication/LogoutButton';
import PropTypes from 'prop-types';
import '../css/style.css';

const { Header } = Layout;

function TopBar({ collapsed, setCollapsed }) {

  const { isAuthenticated, isTeacher, userData } = useAuth();

  const navigate = useNavigate();

  return (
    <>
      <div className="cover-style" />
      <Header className="header-style">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {collapsed ?
              <MenuUnfoldOutlined
                style={{ fontSize: '26px', marginRight: '20px' }}
                onClick={() => setCollapsed(!collapsed)}
              />
              :
              <MenuFoldOutlined style={{ fontSize: '26px', marginRight: '20px' }}
                onClick={() => setCollapsed(!collapsed)} />
            }
            {isAuthenticated && (
              <>
                <Avatar size="large" style={{
                  backgroundColor: '#1677ff',
                  marginRight: "10px",
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }} icon={<UserOutlined />} />
                <span>{userData.name}</span>
              </>
            )}
          </div>
          <div>
            {isTeacher && (
              <FileAddOutlined
                style={{ fontSize: '26px', verticalAlign: 'middle', marginRight: '20px' }}
                onClick={() => navigate('/insert-proposal')}
              />
            )}
            {isAuthenticated ? <LogoutButton /> : <LoginButton />}
          </div>
        </div>
      </Header >
    </>
  )
}

TopBar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  setCollapsed: PropTypes.func.isRequired
}

export default TopBar;