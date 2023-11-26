import { useNavigate } from 'react-router-dom';
import { HomeOutlined, FileTextOutlined, AuditOutlined, SettingOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { useAuth } from '../App';
import '../css/style.css';

const { Sider } = Layout;

function SideBar() {

  const { isLoggedIn, isTeacher } = useAuth();
  const navigate = useNavigate();

  // Define the menu items, using directly the route path as key
  const navigation = [
    { label: "Home", key: "/", icon: <HomeOutlined /> },
    isLoggedIn && { label: "Thesis Proposals", key: "/proposals", icon: <FileTextOutlined /> },
    (isLoggedIn && isTeacher) && { label: "Thesis Applications", key: "/applications", icon: <AuditOutlined /> },
    { type: 'divider' },
    { label: "Administration", key: "/admin/virtual-clock", icon: <SettingOutlined /> }
  ];

  // Handle menu item clicks
  const handleMenuClick = ({ key }) => {
    key && navigate(key);
  };

  return (
    <Sider breakpoint="lg" collapsedWidth="0" style={{ position: "sticky", left: "0", top: "0", height: "100vh", zIndex: "5" }}>
      <div className="logo-style">
        <FileTextOutlined style={{ fontSize: '32px', color: '#1677ff' }} onClick={() => { navigate('/') }} />
      </div>
      <Menu className="menu-style" mode="inline" items={navigation} selectedKeys={[window.location.pathname]} onClick={handleMenuClick} />
    </Sider>
  );
}

export default SideBar;
