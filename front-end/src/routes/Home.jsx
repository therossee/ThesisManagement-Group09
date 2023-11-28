import { Typography } from 'antd';
import '../css/style.css';

const { Title, Paragraph } = Typography;

function Home(props) {

    // Check if userData is available before accessing its properties
    const isUserDataAvailable = props.userData !== null && props.userData !== undefined;

    return (
        <>
        <Title className="home-title">Welcome to Thesis Management System!</Title>
        {(props.isTeacher && isUserDataAvailable) && <Paragraph style={{paddingLeft: "3%"}}>Welcome professor {props.userData.surname}! You can insert a new proposal or take a look for all the application requests.</Paragraph>}
        {(props.isAuthenticated && !props.isTeacher && isUserDataAvailable) && <Paragraph style={{paddingLeft: "3%"}}>Welcome {props.userData.name}! You can insert a new application request or take a look for all the proposals.</Paragraph>}
        {(!props.isAuthenticated) && <Paragraph style={{paddingLeft: "3%"}}>Welcome guest! Start with logging in.</Paragraph>}
        </>
    )
}

export default Home