import { useEffect, useState } from "react";
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from "react-router-dom";
import { list } from "./data";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { getThemeColors } from "./color";

const ListLayout = ({ template, layout }) => {
  const location = useLocation();
  const { accessToken, files, hue } = location.state || {};
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [fileName, setFileName] = useState("");
  const [openNoteIndex, setOpenNoteIndex] = useState(null);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const { gradientLeafbtn, bgbodyColor, bgF1Color, bgF2Color, bgF3Color, bgF4Color, bgColor, gradientConfig, bglabelColor, oppositeColor, oppositeColor1, oppositeColor3, oppositeColor4 } = getThemeColors(hue);

  const getSheetData = async () => {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${files.id}/values/Sheet1!A2:C100`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await res.json();

    const values = data.values || [];
    let updated = values.map((row) => ({
      text: row[0] || "",
      note: row[1] || "",
      bool: row[2] === "TRUE" || row[2] === true,
    }));

    while (updated.length < 12) {
      updated.push({
        text: "",
        note: "",
        bool: false,
      });
    }
    updated.push({
      text: "",
      note: "",
      bool: false,
    });
    setItems(updated);

  };

  const handleChange = (index, field, value
  ) => {
    const newItems = [...items];

    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };

    setItems(newItems);
    if (field == "bool") {
      Submit(index, field, value);
    }
  };

  useEffect(() => {

    if (template == "New") {
      setItems(list.values);
    } else {
      getSheetData();
    }
  }, []);

  async function Submit(index, field, value) {
    const colMap = {
      text: "A",
      note: "B",
      bool: "C",
    };

    const col = colMap[field];

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${files.id}/values/Sheet1!${col}${index + 2}?valueInputOption=USER_ENTERED`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [[value]],
        }),
      }
    );

    getSheetData();
  }

  const deleteRow = async (rowIndex) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this row?"
    );

    if (!confirmDelete) return;

    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${files.id}:batchUpdate`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: [
            {
              deleteDimension: {
                range: {
                  sheetId: 0, // Sheet1 ID
                  dimension: "ROWS",
                  startIndex: rowIndex + 1, // skip header row
                  endIndex: rowIndex + 2,
                },
              },
            },
          ],
        }),
      }
    );

    getSheetData();

  };
  const downloadPDF = () => {
    if (fileName !== "") {
      const doc = new jsPDF();
      doc.text("Status", 10, 10);
      doc.text("Item", 35, 10);
      doc.text("Note", 100, 10);


      let y = 20;

      items.forEach((item, index) => {

        doc.text(item.bool ? "Done" : "Pending", 10, y);
        doc.text(item.text || "", 35, y);
        doc.text(item.note || "", 100, y);

        y += 10;

        // New page if needed
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
      });

      doc.save(fileName + ".pdf");

    } else {
      alert("Please select a file first.");
    }
  };

  const downloadCSV = () => {
    if (fileName !== "") {
      const header = ["Status,Text,Note"];

      const rows = items.map(
        (item, index) =>
          `"${item.bool ? "Done" : "Pending"}","${item.text}","${item.note}"`
      );

      const csvContent = [header, ...rows].join("\n");

      const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;",
      });

      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = fileName + ".csv";
      link.click();
    } else {
      alert("Please select a file first.");
    }
  };


  return (
    <div>
      {template === undefined && (
        <div className="headerLayout" style={{ "--hue": hue }}>
          <div className="account-title">{!files ? "" : ` ${files.name}`}</div>
        </div>
      )}
      <div className="bodyLayout" style={{ "--hue": hue }}>
        <div className="todo-paper">
          <div class="todo-body">
            {items.map((item, index) => (
              <div class="todo-line">
                {((files?.properties?.layout === "Check List") || layout === "Check List") && (
                  <input className="check-box" type="checkbox" checked={item.bool}
                    onChange={(e) =>
                      handleChange(index, "bool", e.target.checked ? "TRUE" : "FALSE"
                      )
                    }
                  />
                )}

                <input className="line-space input-box" type="text" value={item.text}
                  onChange={(e) => handleChange(index, "text", e.target.value)}
                  onBlur={() => Submit(index, "text", item.text)}
                />

                <div style={{ cursor: "pointer", display: "inline-block", position: "relative" }}
                >
                  <span
                    onClick={() =>
                      setOpenNoteIndex(openNoteIndex === index ? null : index)
                    }
                  >
                    {item.note === "" ? "📌" : "📋"}
                  </span>

                  <span
                    onClick={() =>
                      deleteRow(index)
                    }
                  >
                    ❌
                  </span>



                  {openNoteIndex === index && (
                    <div className="tooltip-box">
                      <textarea
                        className="note-box"
                        rows={4}
                        value={item.note}
                        placeholder="Write note..."
                        onChange={(e) =>
                          handleChange(index, "note", e.target.value)
                        }
                        onBlur={() =>
                          Submit(index, "note", item.note)
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

          </div>
        </div>
      </div>
      {template === undefined && (
        <div className="footrLayout" style={{ "--hue": hue }}>
          <div className="inputBox">
            <label className="inputlabel" style={{ background: bglabelColor, }}>Name</label>
            <input
              type="text"
              placeholder="Enter File name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
            />
          </div>
          <div className="inputBox">
            <button className="leaf-btn" style={{ background: gradientLeafbtn, }}
              onClick={() => navigate("/ShareFile", { state: { accessToken: accessToken, files: files, hue: hue } })}>
              Share
            </button>
            <button className="leaf-btn" style={{ background: gradientLeafbtn, }} onClick={() => downloadPDF()}>
              Download PDF
            </button>
            <button className="leaf-btn" style={{ background: gradientLeafbtn, }} onClick={() => downloadCSV()}>
              Download CSV
            </button>
          </div>
        </div>
      )}

      {showDeletePopup && (
        <div className="modal">
          <div className="modal-content">
            <p>Are you sure you want to delete?</p>

            <button onClick={confirmDelete}>Yes</button>
            <button onClick={() => setShowDeletePopup(false)}>
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListLayout;