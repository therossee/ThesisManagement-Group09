import { Typography } from 'antd';
import { useAuth } from '../components/authentication/useAuth';
import { useRef } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

import '../css/style.css';

const { Title, Paragraph } = Typography;

function Home() {

    // We use the useRef hook to get a reference to the slider container
    const sliderRef = useRef(null);
    const scrollAmount = 100; // The amount to scroll when clicking the navigation buttons
    const images = [
        { id: 1, url: "https://imgur.com/hx0bwSH.jpg" },       
        { id: 2, url: "https://imgur.com/f2DDJGc.jpg" },
        { id: 3, url: "https://imgur.com/34iBlOD.jpg" },
        { id: 4, url: "https://imgur.com/Rac3Rjp.jpg" },
    ];

    return (
        //Checking !variable is different than checking variable === false. The second one ensures it doesn't return truthy if undefined.
        <>  
            <HomeText/> 
            <div className="App">
            {/* Left navigation button */}
            <button
                className="nav-btn"
                onClick={() => {
                const container = sliderRef.current;
                container.scrollLeft -= scrollAmount; // Scroll left by the specified amount
                }}
            >
                <LeftOutlined />
            </button>
            {/* Image container */}
            <div className="images-container" ref={sliderRef}>
                {images.map((image) => {
                return (
                    <img
                    className="image"
                    alt="sliderImage"
                    key={image?.id}
                    src={image?.url}
                    />
                );
                })}
            </div>
            {/* Right navigation button */}
            <button
                className="nav-btn"
                onClick={() => {
                const container = sliderRef.current;
                container.scrollLeft += scrollAmount; // Scroll right by the specified amount
                }}
            >
                <RightOutlined />
            </button>
        </div>
        </>
    )
}

function HomeText(){

    const { userData, isAuthenticated, isTeacher } = useAuth();

    return (
        <>
        <Title style={{ textAlign: "center" }} level={1}>👋 Welcome to <span style={{ color: "#1677ff" }}>PoliTO</span> Thesis Management System!</Title>
        {(isTeacher===true) && <Paragraph style={{ textAlign: 'center' }}>Welcome professor {userData? userData.name : ""}! You can insert a new proposal or take a look for all the application requests.</Paragraph>}
        {(isAuthenticated === true && isTeacher === false) && <Paragraph style={{ textAlign: 'center' }}>Welcome {userData? userData.name : ""}! You can insert a new application request or take a look for all the proposals.</Paragraph>}
        {(!isAuthenticated) && <Paragraph style={{ textAlign: 'center' }}>Welcome guest! Start with logging in.</Paragraph>}
        </>
    )
}

export default Home;
export { HomeText };