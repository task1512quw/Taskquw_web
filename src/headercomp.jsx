import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function HeaderComp({ hue, setHue }) {
    const [showMenu, setShowMenu] = useState(false);
    const [showtheme, setShowtheme] = useState(false);

    const navigate = useNavigate();

    const changeHue = (value) => {
        setHue(value);
        localStorage.setItem("myHue", String(value));
    };

    // Load saved theme when app starts
    useEffect(() => {
        const savedHue = localStorage.getItem("myHue");

        if (savedHue !== null) {
            setHue(Number(savedHue));
        } else {
            setHue(50);
        }
    }, [setHue]);

    return (
        <>
            <div className="settings">

                <div
                    className="settingBtn"
                    onClick={() => setShowMenu(!showMenu)}
                >
                    ︙
                </div>

                <div
                    className="settingBtn1"
                    onClick={() => setShowtheme(!showtheme)}
                >
                    ⚙️
                </div>

                {showtheme && (
                    <div>
                        <div className="slidecontainer">

                            <input
                                type="range"
                                min="0"
                                max="360"
                                value={hue}
                                onChange={(e) =>
                                    changeHue(Number(e.target.value))
                                }
                                className="slider rainbow"
                                id="myRange"
                                style={{ margin: "0" }}
                            />

                        </div>
                    </div>
                )}
            </div>

            {/* Popup menu */}
            {showMenu && (
                <div className="menu">

                    <button
                        className="menuItem"
                        onClick={() => {
                            setShowMenu(false);
                            navigate("/AppInfo");
                        }}
                    >
                        <span className="menuText">App Info</span>
                    </button>

                    <button
                        className="menuItem"
                        onClick={() => {
                            setShowMenu(false);
                            navigate("/aboutus",);
                        }}
                    >
                        <span className="menuText">About us</span>
                    </button>

                    <button
                        className="menuItem"
                        onClick={() => {
                            setShowMenu(false);
                            // logout();
                        }}
                    >
                        <span className="menuText">Logout</span>
                    </button>

                </div>
            )}
        </>
    );
}

export default HeaderComp;