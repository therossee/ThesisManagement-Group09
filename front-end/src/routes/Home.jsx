import { Typography } from 'antd';
import { useAuth0 } from '@auth0/auth0-react';
import '../css/style.css';

const { Title, Paragraph } = Typography;

function Home() {

    const  { user, isAuthenticated, isTeacher, isStudent } = useAuth0();

    return (
        <>
        <Title className="home-title">Welcome to Thesis Management System!</Title>
        {(isTeacher) && <Paragraph style={{paddingLeft: "3%"}}>Welcome professor {user.surname}! You can insert a new proposal or take a look for all the application requests.</Paragraph>}
        {(isAuthenticated && !isTeacher) && <Paragraph style={{paddingLeft: "3%"}}>Welcome {user.name}! You can insert a new application request or take a look for all the proposals.</Paragraph>}
        {(!isAuthenticated) && <Paragraph style={{paddingLeft: "3%"}}>Welcome guest! Start with logging in.</Paragraph>}
        </>
    )
}

export default Home