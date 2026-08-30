import { useEffect, useState } from "react";
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from "react-router-dom";
import { tableData } from "./data";
import { getThemeColors } from "./color";

const TableLayout = ({ template }) => {
  const location = useLocation();
  const { accessToken, files } = location.state || {};
  const navigate = useNavigate();
  const [fileName, setFileName] = useState("");
  const [items, setItems] = useState(tableData);
  const [hue, setHue] = useState(50);
  const { gradientLeafbtn, bgbodyColor, bgF1Color, bgF2Color, bgF3Color, bgF4Color, bgColor, gradientConfig, bglabelColor, oppositeColor, oppositeColor1, oppositeColor3, oppositeColor4 } = getThemeColors(hue);

  const getSheetData = async () => {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${files.id}/values/Sheet1`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await res.json();

    setItems(data.values || []);
  };

  useEffect(() => {
    const savedHue = localStorage.getItem("myHue");
    if (savedHue !== null) {
      setHue(Number(savedHue));
    } else {
      setHue(50);
    }

    if (files == undefined) {
    } else {
      getSheetData();
    }
  }, []);

  return (

    <div>
      {template === undefined && (
        <div className="headerLayout" style={{ "--hue": hue }}>
          <h3>{!files ? "" : ` ${files.name}`}</h3>
        </div>)}

      <div style={{ height: template === undefined ? "68%" : "100%", backgroundColor: bgbodyColor, }}>
        <div className="scrollContainer">
          <div className="tableContainer">
            <table border="1" cellPadding="10">
              <thead>
                <tr style={{ backgroundColor: oppositeColor, color: "#FFF" }}>
                  {items[0]?.map((header, i) => (
                    <th key={i}>{header}</th>
                  ))}
                  <th style={{ backgroundColor: oppositeColor }}>
                    <span
                      className="list-update-btn"
                      onClick={() =>
                        navigate("/TableLayoutEdit", {
                          state: {
                            accessToken,
                            files,
                            selectedId: 1,
                          },
                        })
                      }
                    >
                      ➕✏️
                    </span>

                  </th>
                </tr>
              </thead>

              <tbody>
                {items.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex} style={{ backgroundColor: rowIndex % 2 === 0 ? bgbodyColor : bgF4Color, }}>
                    {items[0].map((_, colIndex) => (
                      <td key={colIndex}>{row[colIndex] || ""}</td>
                    ))}
                    <td>
                      <span
                        className="list-update-btn"
                        onClick={() =>
                          navigate("/TableLayoutEdit", {
                            state: {
                              accessToken,
                              files,
                              selectedId: rowIndex + 2,
                            },
                          })
                        }
                      >
                        ✏️
                      </span>

                      <span
                        className="list-update-btn"
                        onClick={() =>
                          navigate("/TableLayoutEdit", {
                            state: {
                              accessToken,
                              files,
                              selectedId: rowIndex + 2,
                            },
                          })
                        }
                      >
                        ❌
                      </span>


                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className="list-add-btn"
            onClick={() =>
              navigate("/TableLayoutEdit", {
                state: {
                  accessToken,
                  files,
                  selectedId: "0",
                },
              })
            }
          >
            + Add new Row;
          </button>
        </div>


      </div>
      {template === undefined && (
        <div className="footrLayout" style={{ "--hue": hue }}>
          <div className="inputBox">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter File name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>
          <div className="inputBox">
            <button className="leaf-btn" onClick={() => getOrCreateFile()}>
              Download PDF
            </button>
            <button className="leaf-btn" onClick={() => getOrCreateFile()}>
              Download CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableLayout;