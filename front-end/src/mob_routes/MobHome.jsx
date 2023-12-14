import { Typography } from 'antd';
import { useAuth } from '../components/authentication/useAuth';
import '../css/style.css';

const { Title, Paragraph } = Typography;

function MobHome() {

    const { userData, isAuthenticated, isTeacher } = useAuth();

    return (
        //Checking !variable is different than checking variable === false. The second one ensures it doesn't return truthy if undefined.
        <>
            <Title className="home-title">Welcome to Thesis Management System!</Title>
            {(isTeacher===true) && <Paragraph style={{ paddingLeft: "3%" }}>Welcome professor {userData? userData.name : ""}! You can insert a new proposal or take a look for all the application requests.</Paragraph>}
            {(isAuthenticated === true && isTeacher === false) && <Paragraph style={{ paddingLeft: "3%" }}>Welcome {userData? userData.name : ""}! You can insert a new application request or take a look for all the proposals.</Paragraph>}
            {(!isAuthenticated) && <Paragraph style={{ paddingLeft: "3%" }}>Welcome guest! Start with logging in.</Paragraph>}
        </>
    )
}

export default MobHome