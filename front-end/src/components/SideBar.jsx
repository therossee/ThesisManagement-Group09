import { useNavigate } from 'react-router-dom';
import { HomeOutlined, FileTextOutlined, HistoryOutlined, AuditOutlined, SettingOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useAuth } from './authentication/useAuth';
import '../css/style.css';

const { Sider } = Layout;

function SideBar() {

  const { isAuthenticated, isTeacher, isTester } = useAuth();
  const navigate = useNavigate();

  // Define the menu items, using directly the route path as key
  const navigation = [
    { label: "Home", key: "/", icon: <HomeOutlined /> },
    isAuthenticated && { label: "Thesis Proposals", key: "/proposals", icon: <FileTextOutlined /> },
    isAuthenticated && { label: isTeacher ? "Thesis Applications" : "Applications History", key: "/applications", icon: isTeacher ? <AuditOutlined /> : <HistoryOutlined /> },
    { type: 'divider' },
    isTester && { label: "Administration", key: "/admin/virtual-clock", icon: <SettingOutlined /> }
  ];

  // Handle menu item clicks
  const handleMenuClick = ({ key }) => {
    key && navigate(key);
  };

  return (
    <Sider breakpoint="lg" collapsedWidth="0" style={{ position: "sticky", left: "0", top: "0", height: "100vh", zIndex: "5" }}>
      <div className='logo-style'>
      <img
        src="https://imgur.com/wYw8LZz.jpg"  
        alt="Polito Logo"
        style={{ width: '90%', cursor: 'pointer', marginTop: '10px', marginBottom: '55px'}}
        onClick={() => navigate('/')}
        onKeyDown={(event) => {
            if (event.key === 'Enter') {
                navigate('/');
            }
        }}
        tabIndex="0" // Ensure the element is focusable
      />
 
      </div>
      <Menu className="menu-style" mode="inline" items={navigation} selectedKeys={[window.location.pathname]} onClick={handleMenuClick} />
    </Sider>
  );
}

export default SideBar;
