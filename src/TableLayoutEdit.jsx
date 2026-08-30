import { useEffect, useState } from "react";
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from "react-router-dom";
import { getThemeColors } from "./color";

const TableLayoutEdit = ({ hue }) => {

  const location = useLocation();
  const { accessToken, files, selectedId } = location.state || {};
  const navigate = useNavigate();
  const [fildName, setFildName] = useState("");
  const [formData, setFormData] = useState([]);
  const { gradientLeafbtn, bgbodyColor, bgF1Color, bgF2Color, bgF3Color, bgF4Color, bgColor, gradientConfig, bglabelColor, oppositeColor, oppositeColor1, oppositeColor3, oppositeColor4 } = getThemeColors(hue);

  useEffect(() => {

    if (!accessToken) {
      alert("accessToken Error")
      return;
    } else {
      GetValue();
    }

  }, [accessToken]);


  async function GetValue() {

    if (selectedId != "") {

      const response1 = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${files.id}/values:batchGet?ranges=Sheet1!1:1&ranges=Sheet1!${selectedId}:${selectedId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response1.json();   // 🔥 IMPORTANT
      console.log("Sheet Data:", data);
      const headers = data.valueRanges[0]?.values?.[0] || [];
      let row = [];

      row = data.valueRanges[1]?.values?.[0] || [];

      const formatted = headers.map((key, index) => ({
        label: key,
        value: row[index] || "",
      }));

      setFormData(formatted);

    }

  }

  async function Submit() {
    try {

      if (files?.selectedId !== "0") {

        const updatedRow =
          formData.map(
            item => item.value
          );

        if (!accessToken) return;
        await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${files?.id}/values/Sheet1!${files?.selectedId}:${files.selectedId}?valueInputOption=RAW`,
          {
            method: "PUT",
            headers: {
              Authorization:
                `Bearer ${accessToken}`,
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              range:
                `Sheet1!${files?.selectedId}:${files?.selectedId}`,
              majorDimension:
                "ROWS",
              values: [
                updatedRow
              ],
            }),
          }
        );

      } else {

        const newRow =
          formData.map(
            item => item.value
          );

        if (!accessToken) return;
        await fetch(
          `https://sheets.googleapis.com/v4/spreadsheets/${files?.id}/values/Sheet1:append?valueInputOption=RAW`,
          {
            method: "POST",
            headers: {
              Authorization:
                `Bearer ${accessToken}`,
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              values: [newRow],
            }),
          }
        );
      }

      alert("Success", "Data saved");

      //navigation.goBack();
      //router.replace({ pathname: "/tablelayout", files: { layout: files?.layout, id: files?.id, headtext: files?.name }, });

    } catch (error) {
      console.error("Error Submit", error)
    }
  }


  const handleChange = (index, newValue) => {
    const updated = [...formData];
    updated[index].value = newValue;
    setFormData(updated);
  };

  const AddColoum = () => {
    setFormData([
      ...formData,
      { value: "" }
    ]);
  };

  return (
    <div>
      <div className="headerLayout" style={{ "--hue": hue }}>
        <h3>Edit</h3>
      </div>
      <div className="bodyLayout" style={{ "--hue": hue }}>

        {formData.map((item, index) => (
          <div className="inputBox">
            <label className="inputlabel" style={{ background: bglabelColor, }}>{selectedId == "1" ? "Name" : item.label}</label>
            <input
              type="text"
              value={item.value}
              onChange={(e) => handleChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>
      <div className="footrLayout" style={{ "--hue": hue }}>
        <div className="inputBox">
          {selectedId == "1" ? (
            <button className="leaf-btn" style={{ background: gradientLeafbtn, }} onClick={() => AddColoum()}>
              Add
            </button>
          ) : null}
          <button className="leaf-btn" style={{ background: gradientLeafbtn, }} onClick={() => Submit()}>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default TableLayoutEdit;