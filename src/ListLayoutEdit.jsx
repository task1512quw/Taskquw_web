import { useEffect, useState } from "react";
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate,useLocation } from "react-router-dom";

const ListLayoutEdit = () => {

  const location = useLocation();
  const { accessToken, files, selectedId } = location.state || {};
  const navigate = useNavigate();
  const [fildName, setFildName] = useState("");

    useEffect(() => {
      
  if (!accessToken) {
     alert("accessToken Error")
    return;
  }

}, [accessToken]);


  async function Submit() {

    if (selectedId !="")
    { 

      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${files.id}/values/Sheet1!A${selectedId}?valueInputOption=USER_ENTERED`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            values: [[fildName]],
          }),
        }
      );
    } else {

    await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${files.id}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              values: [[fildName]]
            }),
          }
        );
    }
        

  }


  return (
    <div>
      <h3>Edit</h3>

      <input type="text" value={fildName} onChange={(e) => setFildName(e.target.value)}/>
       <button onClick={() => Submit()}>
        Submit
       </button>
      
    </div>
  );
};

export default ListLayoutEdit;