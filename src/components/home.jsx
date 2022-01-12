import React from "react";
import { Button, Carousel } from "react-bootstrap";
import './home.css'
import img1 from '../img/people-holding-rubber-heart.jpg'
import img2 from '../img/5257.jpg'
import img3 from '../img/child-holding-red-rubber-heart.jpg'
import { useState } from "react";
import { useEffect } from "react";
export const Home = () => {
    const [arrayHidden, setArrayHidden] = useState([true, true, true, true, true, true]);
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => {
            const newArr = arrayHidden;
            newArr[index] = false;
            setArrayHidden(newArr);
            if (index === 5) clearInterval(interval);
            setIndex(index + 1)
        }, 1000);
    }, [index]);
    return (
        <div id="container">
            <Carousel variant="dark">
                <Carousel.Item>
                    <img src={img1} />
                </Carousel.Item>
                <Carousel.Item >
                    <img src={img2} />
                </Carousel.Item>
                <Carousel.Item>
                    <img src={img3} />
                </Carousel.Item>
            </Carousel>
            <div id="bottomDiv">
                <ul >
                    <ol style={{ padding: 0 }} > <h2 hidden={arrayHidden[0]}><u>YES , YOU CAN</u></h2></ol>
                    <li hidden={arrayHidden[1]}><h4 >To Give</h4></li>
                    <li hidden={arrayHidden[2]}><h4>To Volunteer</h4></li>
                    <li hidden={arrayHidden[3]}><h4>Create Group Of Volunteers</h4></li>
                </ul>
                <marquee hidden={arrayHidden[4]} behavior="scroll" width="100%" direction="left" height="30px">
                    <h4>everyOne to one    everyOne to one    everyOne to one      everyOne to one </h4>
                </marquee>
            </div>
        </div>
    );
}