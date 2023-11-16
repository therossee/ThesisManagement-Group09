import { useNavigate } from 'react-router-dom';
import { HomeOutlined, FileTextOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import '../css/style.css';

const { Sider } = Layout;

// Define the menu items, using directly the route path as key
const navigation = [
  { label: "Home", key: "/", icon: <HomeOutlined /> },
  { type: 'divider' },
  { label: "Administration", key: "/admin/virtual-clock", icon: <HomeOutlined /> }
];

function SideBar() {

  const navigate = useNavigate();

  // Handle menu item clicks
  const handleMenuClick = ({ key }) => {
    key && navigate(key);
  };

  return (
    <Sider className="sider-style" breakpoint="lg" collapsedWidth="0">
      <div className="logo-style">
        <FileTextOutlined style={{ fontSize: '32px', color: '#1677ff' }} onClick={() => { navigate('/') }} />
      </div>
      <Menu className="menu-style" mode="inline" items={navigation} selectedKeys={[window.location.pathname]} onClick={handleMenuClick} />
    </Sider>
  );
}

export default SideBar;
