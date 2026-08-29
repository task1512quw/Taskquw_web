import { useEffect, useState } from "react";

import HeaderComp from "./headercomp";


export default function AboutUs() {
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

            {/* Header */}


            {/* Body */}
            <div
                className="aboutBody"
                style={{

                }}
            >
                <div className="aboutContent">

                    {/* App Title */}
                    <div className="aboutHeader">

                        <div
                            className="logoCircle"
                            style={{

                            }}
                        >
                            <span className="logoText">🌿</span>
                        </div>

                        <h1
                            className="appName"

                        >
                            Your App Name
                        </h1>

                        <p className="version">
                            Version 1.0.0
                        </p>
                    </div>

                    {/* About App */}
                    <div className="aboutCard">

                        <h2
                            className="cardTitle"

                        >
                            About the App
                        </h2>

                        <p className="description">
                            Welcome to our app. We are dedicated to creating
                            a simple, useful, and enjoyable experience for
                            our users.
                        </p>

                        <p className="description">
                            Our app helps users organize, manage, and access
                            their information in a simple and convenient way.
                        </p>

                    </div>

                    {/* Features */}
                    <div className="aboutCard">

                        <h2
                            className="cardTitle"

                        >
                            Features
                        </h2>

                        <p className="item">
                            • Simple and easy-to-use interface
                        </p>

                        <p className="item">
                            • Organized data management
                        </p>

                        <p className="item">
                            • Easy access to your information
                        </p>

                        <p className="item">
                            • Fast and user-friendly experience
                        </p>

                        <p className="item">
                            • Data storage and synchronization support
                        </p>

                    </div>

                    {/* Developer */}
                    <div className="aboutCard">

                        <h2
                            className="cardTitle"

                        >
                            Developer
                        </h2>

                        <p className="label">
                            Created by
                        </p>

                        <p
                            className="developerName"

                        >
                            Pritam Kap
                        </p>

                    </div>

                    {/* Contact */}
                    <div className="aboutCard">

                        <h2
                            className="cardTitle"

                        >
                            Contact Us
                        </h2>

                        <p className="description">
                            If you have any questions, suggestions, feedback,
                            or need support, please feel free to contact us.
                        </p>

                        <p
                            className="email"

                        >
                            your-email@example.com
                        </p>

                    </div>

                    {/* Privacy */}
                    <div className="aboutCard">

                        <h2
                            className="cardTitle"

                        >
                            Data & Privacy
                        </h2>

                        <p className="description">
                            We respect your privacy. Please refer to our
                            Privacy Policy to learn more about how your
                            information is collected, used, and stored.
                        </p>

                    </div>

                    {/* Copyright */}
                    <div className="aboutBottom">

                        <p className="copyright">
                            © 2026 Pritam Kap
                        </p>

                        <p className="copyright">
                            All rights reserved.
                        </p>

                    </div>

                </div>
            </div>

            {/* Footer */}
            <div className="footerGradient" />

            <div
                className="footerMobile"

            />

        </div>
    );
}