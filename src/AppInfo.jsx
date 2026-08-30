import { useEffect, useState } from "react";

import HeaderComp from "./headercomp";


export default function AppInfo() {
    const [hue, setHue] = useState(0);



    useEffect(() => {
        try {
            const savedValue = localStorage.getItem("myHue");

            if (savedValue !== null) {
                setHue(parseInt(savedValue, 10));
            }
        } catch (error) {
            console.error("Error loading hue", error);
        }
    }, []);

    return (
        <div className="aboutPage">

            <div className="footerGradient" />

            <div
                className="footerMobile"

            />

        </div>
    );
}