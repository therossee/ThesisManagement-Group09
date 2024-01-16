import { useNavigate } from 'react-router-dom';
import { HomeOutlined, FileTextOutlined, HistoryOutlined, AuditOutlined, FileDoneOutlined } from '@ant-design/icons';
import { Layout, Menu, Image } from 'antd';
import { useAuth } from './authentication/useAuth';
import PropTypes from 'prop-types';
import '../css/style.css';

const { Sider } = Layout;

function SideBar({ collapsed, setCollapsed }) {

  const { isTeacher, isStudent } = useAuth();
  const navigate = useNavigate();

  // Define the menu items, using directly the route path as key
  const navigation = [
    { label: "Home", key: "/", icon: <HomeOutlined /> },
    (isTeacher === true || isStudent === true) && { label: "Thesis Proposals", key: "/proposals", icon: <FileTextOutlined /> },
    (isTeacher === true || isStudent === true) && { label: isTeacher ? "Thesis Applications" : "Applications History", key: "/applications", icon: isTeacher ? <AuditOutlined /> : <HistoryOutlined /> },
    (isTeacher === true || isStudent === true) && { label: "Thesis Start Request", key: "/start-request", icon: <FileDoneOutlined /> }
  ];

  // Handle menu item clicks
  const handleMenuClick = ({ key }) => {
    key && navigate(key);
  };

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Sider
      breakpoint="lg"
      collapsedWidth="0"
      collapsed={collapsed}
      onCollapse={toggleCollapsed}
      trigger={null}
      style={{ position: "sticky", left: "0", top: "0", height: "100vh", zIndex: "5", backgroundColor: 'white' }}
    >
      <div className='logo-style'>
        <Image
          src="https://upload.wikimedia.org/wikipedia/it/thumb/4/47/Logo_PoliTo_dal_2021_blu.png/1024px-Logo_PoliTo_dal_2021_blu.png"
          alt="Polito Logo"
          style={{ width: '90%', cursor: 'pointer', marginTop: '10px', marginLeft: '10px', marginRight: '10px' }}
          onClick={() => navigate('/')}
          preview={false}
        />
      </div>
      <Menu mode="inline" className='menu-style' items={navigation} selectedKeys={[window.location.pathname]} onClick={handleMenuClick} />
    </Sider>
  );
}

SideBar.propTypes = {
  collapsed: PropTypes.bool.isRequired,
  setCollapsed: PropTypes.func.isRequired,
};

export default SideBar;
