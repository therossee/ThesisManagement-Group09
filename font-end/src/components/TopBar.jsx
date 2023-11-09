import { Avatar, Badge, Layout, Row, Col} from "antd";
import { UserOutlined, BellOutlined } from '@ant-design/icons';
import '../css/style.css';

const { Header } = Layout;

function TopBar() {

    return (
        <Header className="header-style">
            <UserTopBar />
        </Header >
    )
}

function UserTopBar() {

    return (
        <div className="user-topbar-style">
            {/* <Badge count={1}> */}
            <BellOutlined style={{ fontSize: '24px', marginRight: '20px', verticalAlign: 'middle' }}/>
            {/*</Badge>*/}
            <Avatar size="large" style={{ backgroundColor: '#1677ff', verticalAlign: 'middle' }}>
                <UserOutlined />
            </Avatar>
        </div>

    )
}

export default TopBar;