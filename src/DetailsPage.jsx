import { useEffect, useState } from "react";
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from "react-router-dom";

import ListLayout from "./ListLayout";
import TableLayout from "./TableLayout";
import TreeLayout from "./TreeLayout";
//import "./styles.css";


function DetailsPage({ hue }) {
  const location = useLocation();
  const { accessToken, files } = location.state || {};
  const navigate = useNavigate();
  const [user, setUser] = useState(null);


  useEffect(() => {
    if (!accessToken) {
      navigate("/")
      return;
    }

    Page_content();
  }, [accessToken]);


  async function Page_content() {

    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${files.id}/values/Sheet1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await res.json();

  }
  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/drive.readonly",
    onSuccess: async (tokenResponse) => {


      // get user info
      const userInfo = await fetch(
        "https://www.googleapis.com/oauth2/v1/userinfo?accessToken=" + tokenResponse.accessToken
      ).then(res => res.json());

      setUser(userInfo);

      // fetch Google Sheets files
      const driveRes = await fetch(
        "https://www.googleapis.com/drive/v3/files?q=mimeType='application/vnd.google-apps.spreadsheet' and name contains 'PKapp'&fields=files(id,name)",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`,
          },
        }
      );

      const data = await driveRes.json();
      setFiles(data.files);
    },
    onError: () => console.log("Login Failed"),
  });

  return (
    <div className="centerDiv">

      <div style={{ display: files.properties.layout.includes("List") ? "block" : "none" }}>
        <ListLayout hue={hue} />
      </div>
      <div style={{ display: files.properties.layout == "Tree" ? "block" : "none" }}>
        <TreeLayout hue={hue} />
      </div>
      <div style={{ display: files.properties.layout == "Table" ? "block" : "none" }}>
        <TableLayout hue={hue} />
      </div>
    </div>
  );
}

export default DetailsPage;