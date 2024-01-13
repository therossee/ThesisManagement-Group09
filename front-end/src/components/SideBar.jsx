import { useNavigate } from 'react-router-dom';
import { HomeOutlined, FileTextOutlined, HistoryOutlined, AuditOutlined, QuestionOutlined } from '@ant-design/icons';
import { Layout, Menu, Image } from 'antd';
import { useAuth } from './authentication/useAuth';
import '../css/style.css';

const { Sider } = Layout;

function SideBar() {

  const { isTeacher, isStudent, isSecretaryClerk } = useAuth();
  const navigate = useNavigate();

  // Define the menu items, using directly the route path as key
  const navigation = [
    { label: "Home", key: "/", icon: <HomeOutlined /> },
    (isTeacher === true || isStudent === true) && { label: "Thesis Proposals", key: "/proposals", icon: <FileTextOutlined /> },
    { label: isTeacher ? "Thesis Applications" : "Applications History", key: "/applications", icon: isTeacher ? <AuditOutlined /> : <HistoryOutlined /> },
    isSecretaryClerk && { label: isSecretaryClerk && "Thesis Start Request" , key: "/thesis-start-request", icon: isSecretaryClerk && <QuestionOutlined /> },
  ];

  // Handle menu item clicks
  const handleMenuClick = ({ key }) => {
    key && navigate(key);
  };

  return (
    <Sider breakpoint="lg" collapsedWidth="0" style={{ position: "sticky", left: "0", top: "0", height: "100vh", zIndex: "5", backgroundColor: 'white' }}>
      <div className='logo-style'>
      <Image
        src="https://imgur.com/wYw8LZz.jpg"  
        alt="Polito Logo"
        style={{ width: '90%', cursor: 'pointer', marginTop: '10px', marginBottom: '50px', marginLeft: '10px', marginRight: '10px'}}
        onClick={() => navigate('/')}
        preview={false}
      />
      </div>
      <Menu mode="inline" className='menu-style' items={navigation} selectedKeys={[window.location.pathname]} onClick={handleMenuClick} />
    </Sider>
  );
}

export default SideBar;
