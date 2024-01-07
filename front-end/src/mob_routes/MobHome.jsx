import { useRef } from 'react';
import { HomeText } from '../routes/Home';
import '../css/style.css';

function MobHome() {

    // We use the useRef hook to get a reference to the slider container
    const mobSliderRef = useRef(null);
    const mobImages = [
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
            {/* Image container */}
            <div className="images-container" ref={mobSliderRef}>
                {mobImages.map((image) => {
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