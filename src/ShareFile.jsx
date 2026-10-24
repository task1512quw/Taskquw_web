import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getThemeColors } from "./color";

function ShareFile() {
    const location = useLocation();

    const { accessToken, files, hue } = location.state || {};

    const {
        gradientLeafbtn,
        bgbodyColor,
        bglabelColor,
        gradientConfig,
        oppositeColor,
    } = getThemeColors(hue);

    const [email, setEmail] = useState("");
    const [role, setRole] = useState("reader");
    const [loading, setLoading] = useState(false);
    const [sharedUsers, setSharedUsers] = useState([]);

    const shareFile = async () => {
        if (!email.trim()) {
            alert("Please enter an email address.");
            return;
        }

        try {
            setLoading(true);

            if (!accessToken) {
                alert("Unable to get access token.");
                return;
            }

            const response = await fetch(
                `https://www.googleapis.com/drive/v3/files/${files?.id}/permissions`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        role: role,
                        type: "user",
                        emailAddress: email.trim(),
                    }),
                }
            );

            const result = await response.json();

            if (response.ok) {
                alert("File shared successfully.");
                setEmail("");

                // Refresh shared users
                getSharedUsers();
            } else {
                alert(
                    result.error?.message ||
                    "Unable to share file."
                );
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const getSharedUsers = async () => {

        try {
            setLoading(true);
            if (!accessToken) {
                alert("Unable to get access token.");
                return;
            }
            console.log("accessToken", accessToken)

            console.log("files", files)
            const response = await fetch(
                `https://www.googleapis.com/drive/v3/files/${files?.id}/permissions?fields=permissions(id,type,emailAddress,displayName,role)`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            const result = await response.json();
            console.log("result", result)
            if (response.ok) {
                setSharedUsers(result.permissions || []);
            } else {
                alert(
                    result.error?.message ||
                    "Unable to get shared users."
                );
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getSharedUsers();
    }, [files?.id]);

    return (
        <>
            <div className="headerLayout" style={{ "--hue": hue }}>
                <div className="account-title"> Share Account</div>
                <div className="account-title"> {!files ? "" : ` ${files.name}`}</div>
            </div>

            {/* Body */}
            <div className="bodyLayout" style={{ "--hue": hue }}>
                {/* Email */}
                <div className="inputBox">

                    <label
                        className="inputlabel"
                        style={{
                            backgroundColor: bglabelColor,
                        }}
                    >
                        Email
                    </label>

                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) =>
                            setEmail(e.target.value)
                        }
                        className="inputtext"
                    />

                </div>

                <label
                    className="inputlabel"
                    style={{
                        backgroundColor: bglabelColor,
                    }}
                >
                    Permission
                </label>


                <div className="roleRow">
                    <button
                        className={`roleButton ${role === "reader"
                            ? "selectedButton"
                            : ""
                            }`}
                        onClick={() => setRole("reader")}
                    >
                        <span
                            className={`roleText ${role === "reader"
                                ? "selectedText"
                                : ""
                                }`}
                        >
                            Viewer
                        </span>
                    </button>


                    {/* Writer */}
                    <button
                        className={`roleButton ${role === "writer"
                            ? "selectedButton"
                            : ""
                            }`}
                        onClick={() => setRole("writer")}
                    >
                        <span
                            className={`roleText ${role === "writer"
                                ? "selectedText"
                                : ""
                                }`}
                        >
                            Editor
                        </span>
                    </button>

                </div>


                {/* Shared Users */}
                <div className="sharedUsers">

                    {sharedUsers.map((user) => (
                        <div
                            key={user.id}
                            className="sharedUser"
                        >
                            <div className="userName">
                                {user.displayName ||
                                    "Unknown user"}
                            </div>

                            <div className="userEmail">
                                {user.emailAddress}
                            </div>

                            <div className="userRole">
                                Role: {user.role}
                            </div>
                        </div>
                    ))}

                </div>

            </div>

            <div className="footrLayout" style={{ "--hue": hue }}>

                <button
                    className="leafBtn"
                    onClick={shareFile}
                    disabled={loading}
                    style={{
                        background:
                            gradientLeafbtn?.background,
                        color: oppositeColor,
                    }}
                >
                    {loading ? "Sharing..." : "Share File"}
                </button>

            </div>

        </>
    );
}

export default ShareFile;