import { Typography } from 'antd';
import { useAuth } from '../components/authentication/useAuth';
import { useRef, useState } from 'react';
import '../css/style.css';

const { Title, Paragraph } = Typography;

function MobHome() {

    const { userData, isAuthenticated, isTeacher } = useAuth();

    // We use the useRef hook to get a reference to the slider container
    const sliderRef = useRef(null);
    const [images] = useState([
        { id: 1, url: "https://imgur.com/hx0bwSH.jpg" },       
        { id: 2, url: "https://imgur.com/f2DDJGc.jpg" },
        { id: 3, url: "https://imgur.com/34iBlOD.jpg" },
        { id: 4, url: "https://imgur.com/Rac3Rjp.jpg" },
    ]);

    return (
        //Checking !variable is different than checking variable === false. The second one ensures it doesn't return truthy if undefined.
        <>
            <Title className="home-title" style={{textAlign: 'center'}}>Welcome to PoliTO Thesis Management System!</Title>
            {(isTeacher===true) && <Paragraph style={{ paddingLeft: "3%", textAlign: 'center' }}>Welcome professor {userData? userData.name : ""}! You can insert a new proposal or take a look for all the application requests.</Paragraph>}
            {(isAuthenticated === true && isTeacher === false) && <Paragraph style={{ paddingLeft: "3%", textAlign: 'center' }}>Welcome {userData? userData.name : ""}! You can insert a new application request or take a look for all the proposals.</Paragraph>}
            {(!isAuthenticated) && <Paragraph style={{ paddingLeft: "3%", textAlign: 'center' }}>Welcome guest! Start with logging in.</Paragraph>}
            <div className="App">
            {/* Image container */}
            <div className="images-container" ref={sliderRef}>
                {images.map((image) => {
                return (
                    <img
                    className="image-mobile"
                    alt="sliderImage"
                    key={image?.id}
                    src={image?.url}
                    />
                );
                })}
            </div>
            </div>
        </>
    )
}

export default MobHome