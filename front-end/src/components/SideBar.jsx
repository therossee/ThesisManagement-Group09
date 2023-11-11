import { useNavigate } from 'react-router-dom';
import { HomeOutlined, FileTextOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import '../css/style.css';

const { Sider } = Layout;

// Define the menu items, using directly the route path as key
const navigation = [
  { label: "Home", key: "/", icon: <HomeOutlined /> },
  { type: 'divider' },
];

function SideBar() {

  const navigate = useNavigate();

  // Handle menu item clicks
  const handleMenuClick = ({ key }) => {
    key && navigate(key);
  };

  return (
    <Sider breakpoint="lg" collapsedWidth="0" style={{ position: "sticky", left: "0", top: "0", height: "100vh", zIndex: "5"}}>
      <div className="logo-style">
        <FileTextOutlined style={{ fontSize: '32px', color: '#1677ff' }} onClick={() => { navigate('/') }} />
      </div>
      <Menu className="menu-style" mode="inline" items={navigation} selectedKeys={[window.location.pathname]} onClick={handleMenuClick} />
    </Sider>
  );
};

export default SideBar;