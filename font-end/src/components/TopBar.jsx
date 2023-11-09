import { Avatar, Badge, Button, Input, Layout, Form } from "antd";
import { UserOutlined, BellOutlined, KeyOutlined } from '@ant-design/icons';
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
        <Form layout="inline" style={{marginTop: "15px"}}>
        <Form.Item>
            <Input
              prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              placeholder="Username"
            />
        </Form.Item>
        <Form.Item>
            <Input
              prefix={<KeyOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
              type="password"
              placeholder="Password"
            />
        </Form.Item>
        <Form.Item>
          <Button type="primary">
            Log in
          </Button>
        </Form.Item>
      </Form>
        /*
        <div className="user-topbar-style">
            <Badge count={1}>
            <BellOutlined style={{ fontSize: '24px', marginRight: '20px', verticalAlign: 'middle' }}/>
            </Badge>
            <Avatar size="large" style={{ backgroundColor: '#1677ff', verticalAlign: 'middle' }}>
                <UserOutlined />
            </Avatar>
        </div>
        */

    )
}

export default TopBar;