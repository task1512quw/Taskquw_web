import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { MdFolder, MdFolderOpen } from "react-icons/md";
import { getThemeColors } from "./color";

const TreeNode = ({ node }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { accessToken, files } = location.state || {};
  const [hue, setHue] = useState(50);
  const { gradientLeafbtn, bgbodyColor, bgF1Color, bgF2Color, bgF3Color, bgF4Color, bgColor, gradientConfig, bglabelColor, oppositeColor, oppositeColor1, oppositeColor3, oppositeColor4 } = getThemeColors(hue);
  

  return (

    <li>
      <div className="node-row">
        <span
          className="toggle"
          onClick={() => setIsOpen(!isOpen)}
        >
          {node.children ? (isOpen ? (<MdFolderOpen size={24} color={oppositeColor} />) :
            (<MdFolder size={24} color={oppositeColor1} />)) : "•"}
        </span>

        <div>

          <div class="nodeName">
            {node.name}
          </div>
        </div>
      </div>

      {isOpen && node.children && (
        <ul>
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} />
          ))}
        </ul>
      )}
    </li>


  );
};

export default TreeNode;