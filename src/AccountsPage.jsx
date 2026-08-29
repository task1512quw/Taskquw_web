import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";


function AccountsPage() {
  const [user, setUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  const [sheetaccess, setSheetaccess] = useState("none");

  const navigate = useNavigate();
  const location = useLocation();
  const access_token = location.state;
  const tokenClientRef = useRef(null);
  const [hue, setHue] = useState(50);


  useEffect(() => {
    const savedHue = localStorage.getItem("myHue");

    if (savedHue !== null) {
      setHue(Number(savedHue));
    } else {
      setHue(50);
    }
    console.log(access_token);
    if (!access_token) {

      navigate("/")
      return;
    }

    Account_details();
  }, [access_token]);

  function initGoogleAuth() {
    tokenClientRef.current = google.accounts.oauth2.initTokenClient({

      client_id: "2799593297-t7c7s058d9inlbfl37et9837ob39ku5f.apps.googleusercontent.com",
      //client_id: "470784951477-1mcdh3c1puclmb9ttot8mchl3onvsshb.apps.googleusercontent.com",
      scope: "https://www.googleapis.com/auth/drive",
      callback: (response) => {
        console.log("callback", response);
        alert("Login successful!");
      },
      error_callback: (err) => {
        console.error("error", err);

        if (err.type === "popup_failed_to_open") {
          alert("Popup was blocked by your browser. Please allow popups and try again.");
        } else if (err.type === "popup_closed") {
          alert("Login popup was closed before completing authentication.");
        } else {
          alert("Google login failed. Please try again.");
        }
      }
    });
  }

  function handleLogin() {
    console.log("login clicked");
    console.log(tokenClientRef.current);
    tokenClientRef.current?.requestAccessToken();
  }

  async function Account_details() {
    const userInfo = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo?access_token=" + access_token
    ).then(res => res.json());
    setUser(userInfo);

    const query = "mimeType='application/vnd.google-apps.spreadsheet'";

    const url = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
      query
    )}&fields=files(id,name,properties,appProperties)`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      console.log(data)
      setFiles(data.files);
    } catch (error) {
      setSheetaccess("block")
      initGoogleAuth();
      console.error("Fetch error:", error);
    }

  }



  return (

    <div>
      <div className="headerLayout" style={{ "--hue": hue }}>
        <h4>Account</h4>

      </div>
      <div className="bodyLayout" style={{ "--hue": hue }}>
        <div style={{ display: sheetaccess }}>
          <br></br>
          <button className="leaf-btn" onClick={handleLogin}>
            Continue with Google Sheet
          </button>
        </div>
        {!user ? (
          <button onClick={() => navigate("/sheets")}>
            Re Login
          </button>
        ) : (
          <div className="innrContainer">
            {files && files.length > 0 && (
              <ul className="fileList">
                {files.map((file, index) => (
                  <li key={file.id}
                    className={`fileItem ${selectedFile?.id === file.id ? "active" : ""}`}
                    onClick={() => //setSelectedFile(file)
                      navigate("/Details", { state: { access_token: access_token, files: file, hue: hue } })
                    } >
                    <span className="fileNumber">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="fileName">{file.name}</span>

                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      <div className="footrLayout" style={{ "--hue": hue }}>
        {/* <div>
          <button className="leaf-btn" onClick={() => navigate("/Details", { state: { access_token: access_token, files: selectedFile, hue: hue } })}>
            Open
          </button>
          <button className="leaf-btn" onClick={() => navigate("/Share", { state: { access_token: access_token, files: selectedFile, hue: hue } })}>
            Share
          </button>
        </div> */}
        <div style={{ margin: '20px' }}>
          <button className="leaf-btn" onClick={() => navigate("/create", { state: { access_token: access_token } })}>
            Create New Account
          </button>
        </div>
      </div>

    </div>
  );
}

export default AccountsPage;