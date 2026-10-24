import { useEffect, useState } from "react";
import { useGoogleLogin } from '@react-oauth/google';
import { useNavigate, useLocation } from "react-router-dom";
import TreeView from "./TreeView";
import { treeview } from "./data";
import { getThemeColors } from "./color";



const TreeLayout = ({ template, hue }) => {
  const location = useLocation();
  const { accessToken, files } = location.state || {};
  const navigate = useNavigate();
  const [treeData, setTreeData] = useState(treeview);
  const { gradientLeafbtn, bgbodyColor, bgF1Color, bgF2Color, bgF3Color, bgF4Color, bgColor, gradientConfig, bglabelColor, oppositeColor, oppositeColor1, oppositeColor3, oppositeColor4 } = getThemeColors(hue);
  const [fileName, setFileName] = useState("");
  const getSheetData = async () => {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${files.id}/values/Sheet1!A1:C100`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await res.json();

    const rows = data.values.slice(1);

    const list = rows.map((r, index) => ({
      id: Number(r[0]),
      name: r[1],
      parent: Number(r[2]),
      rowNumber: index + 2
    }));

    const buildTree = (list) => {
      const map = {};
      const roots = [];

      list.forEach(item => {
        map[item.id] = { ...item, children: [] };
      });

      list.forEach(item => {
        if (item.parent === 0) {
          roots.push(map[item.id]);
        } else {
          map[item.parent]?.children.push(map[item.id]);
        }
      });
      return roots;
    };

    const treeData = buildTree(list);

    const formattedTree = treeData.map(node => ({
      label: node.name,
      value: node.id,
      children: node.children,
      rowNumber: node.rowNumber,
    }));

    setTreeData(formattedTree);


  };

  const handleAddRoot = () => {
    if (!nodetext.trim()) {
      Alert.alert(
        "Validation",
        "Please enter a node name."
      );
      return;
    }

    const node = findNodeById(treeData, selectnode);

    const newNode = {
      id: getLastId(treeData) + 1,
      name: nodetext,
      parent: node?.parent ?? 0,
      rowNumber: 6,
      children: [],
    };

    saveNode(newNode);

    setTreeData((prev) =>
      addChildNode(prev, node?.parent ?? 0, newNode)
    );
  };

  const handleAddChild = () => {

    if (!nodetext.trim()) {
      Alert.alert(
        "Validation",
        "Please enter a node name."
      );
      return;
    }
    const node = findNodeById(treeData, selectnode);

    const newNode = {
      id: getLastId(treeData) + 1,
      name: nodetext,
      parent: selectnode,
      rowNumber: 6,
      children: [],
    };

    saveNode(newNode);

    setTreeData((prev) =>
      addChildNode(prev, node?.parent ?? 0, newNode)
    );
  };

  const deleteNodeFromSheet = async () => {
    try {

      const node = findNodeById(treeData, selectnode);
      if (node == null) return;
      const accessToken = await getAccessToken();
      if (!accessToken) return false;

      const rows = getRowsToDelete(node);

      // Delete from bottom to top
      rows.sort((a, b) => b - a);

      const requests = rows.map((row) => ({
        deleteDimension: {
          range: {
            sheetId: 0, // Sheet1
            dimension: "ROWS",
            startIndex: row - 1,
            endIndex: row,
          },
        },
      }));

      const res = await fetch(
        `https://sheets.googleapis.com/v4/spreadsheets/${params?.id}:batchUpdate`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requests,
          }),
        }
      );

      const data = await res.json();

      return true;
    } catch (error) {
      console.error("Error deleteNodeFromSheet", error);
      return false;
    }
  };

  useEffect(() => {
    if (template == "New") {
    } else {
      getSheetData();
    }
  }, []);

  return (
    <div>
      {template === undefined && (
        <div className="headerLayout" style={{ "--hue": hue }}>
          {files && <h4>{files.name}</h4>}
        </div>
      )}
      <div className="bodyLayout" style={{ "--hue": hue }}>
        <TreeView data={treeData} />


      </div>
      {template === undefined && (
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
            <button className="leaf-btn" style={{ background: gradientLeafbtn, }} onClick={() => handleAddRoot()}>
              Root
            </button>
            <button className="leaf-btn" style={{ background: gradientLeafbtn, }} onClick={() => handleAddChild()}>
              Child
            </button>
            <button className="leaf-btn" style={{ background: gradientLeafbtn, }} onClick={() => deleteNodeFromSheet()}>
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TreeLayout;