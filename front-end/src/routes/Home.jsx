import { Typography } from 'antd';
import { useAuth } from '../App';
import '../css/style.css';

const { Title, Paragraph } = Typography;

function Home() {

    const  { isLoggedIn, isTeacher, user } = useAuth();

    return (
        <>
        <Title className="home-title">Welcome to Thesis Management System!</Title>
        {(isTeacher) && <Paragraph style={{paddingLeft: "2%"}}>Welcome professor {user.surname}! You can insert a new proposal or take a look for all the application requests.</Paragraph>}
        {(isLoggedIn && !isTeacher) && <Paragraph style={{paddingLeft: "2%"}}>Welcome {user.name}! You can insert a new application request or take a look for all the proposals.</Paragraph>}
        {(!isLoggedIn) && <Paragraph style={{paddingLeft: "2%"}}>Welcome guest! Start with logging in.</Paragraph>}
        </>
    )
}

export default Home