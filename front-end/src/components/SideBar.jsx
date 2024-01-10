import { useNavigate } from 'react-router-dom';
import { HomeOutlined, FileTextOutlined, HistoryOutlined, AuditOutlined, SettingOutlined, FileDoneOutlined } from '@ant-design/icons';
import { Layout, Menu, Image } from 'antd';
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
    isAuthenticated && { label: "Thesis Start Request", key: "/start-request", icon: <FileDoneOutlined /> }
  ];

  // Handle menu item clicks
  const handleMenuClick = ({ key }) => {
    key && navigate(key);
  };

  return (
    <Sider breakpoint="lg" collapsedWidth="0" style={{ position: "sticky", left: "0", top: "0", height: "100vh", zIndex: "5", backgroundColor: 'white' }}>
      <div className='logo-style'>
      <Image
        src="https://upload.wikimedia.org/wikipedia/it/thumb/4/47/Logo_PoliTo_dal_2021_blu.png/1024px-Logo_PoliTo_dal_2021_blu.png"  
        alt="Polito Logo"
        style={{ width: '90%', cursor: 'pointer', marginTop: '10px', marginLeft: '10px', marginRight: '10px'}}
        onClick={() => navigate('/')}
        preview={false}
      />
 
      </div>
      <Menu mode="inline" className='menu-style' items={navigation} selectedKeys={[window.location.pathname]} onClick={handleMenuClick} />
    </Sider>
  );
}

export default SideBar;
