import React from "react";
import Tilt from 'react-parallax-tilt';
import logo from './logo.jpg'

const Logo = () => {
return (
    <div className='ma4 mt0 '>
    <div style={{ height: '150px', width:'150px'}}>
    <Tilt
    tiltMaxAngleX={35}
    tiltMaxAngleY={35}
    perspective={900}
    scale={1}
    transitionSpeed={2000}
    gyroscope={true}
    >
    <img src={logo} className="inner-element" alt="pic" />
    </Tilt>
    </div>
    </div>
);

}

export default Logo;
