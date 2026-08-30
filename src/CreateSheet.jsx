import { useGoogleLogin } from "@react-oauth/google";
import { useState, useEffect } from "react";
import TV from "./TV";
import { useNavigate, useLocation } from "react-router-dom";
import ListLayout from "./ListLayout";
import TableLayout from "./TableLayout";
import TreeLayout from "./TreeLayout";
import { getThemeColors } from "./color";

function CreateSheet({ hue }) {
  const location = useLocation();
  const { accessToken } = location.state || {};
  const [layout, setLayout] = useState("List");
  const [fileName, setFileName] = useState("");
  const layoutOptions = ["List", "Check List", "Table", "Tree"];
  const { gradientLeafbtn, bgbodyColor, bgF1Color, bgF2Color, bgF3Color, bgF4Color, bgColor, gradientConfig, bglabelColor, oppositeColor, oppositeColor1, oppositeColor3, oppositeColor4 } = getThemeColors(hue);
  const [loading, setLoading] = useState(false);

  async function getOrCreateFile() {
    if (!fileName.trim()) {
      alert("Please enter an account name");
      return;
    }
    setLoading(true);
    try {
      const query = `name='${fileName}' and mimeType='application/vnd.google-apps.spreadsheet' and trashed=false`;

      // 1️⃣ Check if file exists
      const searchRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const searchData = await searchRes.json();

      if (searchData.files && searchData.files.length > 0) {
        // ✅ File exists
        const fileId = searchData.files[0].id;
        alert("File already exists:", fileId);
        setLoading(false);
        return fileId;
      }

      // 2️⃣ Create file if not found
      const createRes = await fetch(
        "https://www.googleapis.com/drive/v3/files",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: fileName,
            mimeType: "application/vnd.google-apps.spreadsheet",
            properties: {
              app: "PKapp",
              layout: layout
            }
          }),
        }
      );

      const createData = await createRes.json();
      const spreadsheetId = createData.id;

      // Wait a moment for spreadsheet creation
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Create Sheet2
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requests: [
              {
                addSheet: {
                  properties: {
                    title: "Sheet2",
                  },
                },
              },
            ],
          }),
        }
      );

      // Write Sheet1 headers
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:C1?valueInputOption=RAW`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            values: [["text", "note", "bool"]],
          }),
        }
      );

      // Write Sheet2 values
      await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet2!A1:B2?valueInputOption=RAW`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            range: "Sheet2!A1:B2",
            majorDimension: "ROWS",
            values: [
              ["Notifications token", "Admin"],
              ["", "False"],
            ],
          }),
        }
      );

      alert("Success", "created successfully.");
      setLoading(false);
    } catch (error) {
      console.error("Error getOrCreateFile", error);
      alert("Error", "Failed to create spreadsheet.");
      setLoading(false);
    }
  }

  const [index, setIndex] = useState(0);
  const totalSlides = 4;

  const moveSlide = (direction) => {

    let newIndex = index + direction;

    if (newIndex < 0) {
      newIndex = totalSlides - 1;
    }

    if (newIndex >= totalSlides) {
      newIndex = 0;
    }

    setIndex(newIndex);
    setLayout(layoutOptions[newIndex])
  };

  const currentSlide = (n) => {
    setIndex(n);
    setLayout(layoutOptions[n])
  };

  // useEffect(() => {
  //   const savedHue = localStorage.getItem("myHue");
  //   if (savedHue !== null) {
  //     setHue(Number(savedHue));
  //   } else {
  //     setHue(50);
  //   }
  // }, []);

  return (
    <>
      <div className="headerLayout" style={{ "--hue": hue }}>

        <h4>Choose Template</h4>
      </div>
      <div className="bodyLayout" style={{ "--hue": hue }}>

        <div className="carousel">

          <div
            className="carousel-track"
            style={{
              transform: `translateX(-${index * 100}%)`,
            }}
          >

            <div className="slide">
              <div className="card" >
                <ListLayout template="New" layout="" />
              </div>
            </div>

            <div className="slide">
              <div className="card">
                <ListLayout template="New" layout="Check List" />
              </div>
            </div>

            <div className="slide">
              <div className="card">
                <TableLayout template="New" />
              </div>
            </div>

            <div className="slide">
              <div className="card">
                <TreeLayout template="New" />
              </div>
            </div>

          </div>
          <button className="arrow prev" onClick={() => moveSlide(-1)}>
            ❮
          </button>
          <button className="arrow next" onClick={() => moveSlide(1)}>
            ❯
          </button>

        </div>



      </div>
      <div className="footrLayout" style={{ "--hue": hue }}>
        <div className="inputBox" >
          <label className="inputlabel" style={{ background: bglabelColor, }}>Name</label>
          <input
            type="text"
            placeholder="Enter Acount name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            required
          />
        </div>
        <div className="inputBox">
          <button className="leaf-btn" style={{ background: gradientLeafbtn, }} onClick={() => getOrCreateFile()}>
            Create Sheet
          </button>
        </div>
      </div>
      {/* <button onClick={downloadPDF}>Download PDF</button>
        <button onClick={downloadCSV}>Download CSV</button> */}
      {loading && (
        <div className="loaderOverlay">
          <div
            className="loaderSpinner"
            style={{ borderTopColor: oppositeColor }}
          ></div>
        </div>
      )}
    </>

  );
}
export default CreateSheet;