import { useEffect, useState } from "react";

import { getThemeColors } from "./color";
export default function AboutUs({ hue }) {

    const { gradientLeafbtn, bgbodyColor, bgF1Color, bgF2Color, bgF3Color, bgF4Color, bgColor, gradientConfig, bglabelColor, oppositeColor, oppositeColor1, oppositeColor3, oppositeColor4 } = getThemeColors(hue);

    return (
        <>
            <div className="headerLayout" style={{ "--hue": hue }}>

                <div className="account-title">About us</div>
            </div>
            <div className="bodyLayout" style={{ "--hue": hue }}>
                <div className="app-info">
                    <div className="app-logo" style={{ backgroundColor: bgColor }} >
                        🌿
                    </div>

                    <div className="app-name" style={{ color: bgColor }}>Your App Name</div>
                    <div className="app-version">Version 1.0.0</div>
                </div>


                {/* About App */}
                <div className="info-card">
                    <div className="card-title" style={{ color: bgColor }}>About the App</div>
                    <div className="card-text">
                        Welcome to our app. We are dedicated to creating
                        a simple, useful, and enjoyable experience for
                        our users.
                    </div>
                    <div className="card-text">
                        Our app helps users organize, manage, and access
                        their information in a simple and convenient way.
                    </div>
                </div>
                <div className="info-card">
                    <div className="card-title" style={{ color: bgColor }}>Features</div>
                    <div className="feature">
                        • Simple and easy-to-use interface
                    </div>

                    <div className="feature">
                        • Organized data management
                    </div>

                    <div className="feature">
                        • Easy access to your information
                    </div>

                    <div className="feature">
                        • Fast and user-friendly experience
                    </div>

                    <div className="feature">
                        • Data storage and synchronization support
                    </div>

                </div>

                <div className="info-card">
                    <div className="card-title" style={{ color: bgColor }}>Developer</div>
                    <div className="card-text">
                        Created by
                    </div>
                    <div className="card-title" style={{ color: oppositeColor }}>Pritam Kap</div>

                </div>
                <div className="info-card">
                    <div className="card-title" style={{ color: bgColor }}>Contact Us</div>
                    <div className="card-text">
                        If you have any questions, suggestions, feedback,
                        or need support, please feel free to contact us.
                    </div>
                    <div className="card-title" style={{ color: oppositeColor }}>your-email@example.com</div>
                </div>

                <div className="info-card">
                    <div className="card-title" style={{ color: bgColor }}>Data & Privacy</div>
                    <div className="card-text">
                        We respect your privacy. Please refer to our
                        Privacy Policy to learn more about how your
                        information is collected, used, and stored.
                    </div>

                </div>



            </div>

            <div className="footrLayout" style={{ "--hue": hue }}>
                <div className="about-bottom">

                    <p className="about-copyright">
                        © 2026 Pritam Kap
                    </p>

                    <p className="about-copyright">
                        All rights reserved.
                    </p>

                </div>

            </div>
        </>
    );
}