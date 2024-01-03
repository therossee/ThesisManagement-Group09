import { useNavigate } from "react-router-dom";
import { Badge, Layout } from "antd";
import { BellOutlined, FileAddOutlined, InboxOutlined } from '@ant-design/icons';
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
          <LoginButton />
        }
      </Header >
    </>
  )
}

function IsLoggedInForm() {

  const { isTeacher } = useAuth();
  const navigate = useNavigate();

  return (
    <div>
      {
        isTeacher &&
        <>
        <FileAddOutlined style={{ fontSize: '22px', verticalAlign: 'middle', marginRight: "20px" }} onClick={() => navigate("/insert-proposal")} />
        <InboxOutlined style={{ fontSize: '22px', verticalAlign: 'middle', marginRight: "20px" }} onClick={() => navigate("/archive")}/>
        </>
      }
      <Badge count={1} style={{ marginRight: '22px' }}>
        <BellOutlined style={{ fontSize: '22px', marginRight: '22px', verticalAlign: 'middle' }} />
      </Badge>
      <LogoutButton />
    </div>
  )
}


export default TopBar;