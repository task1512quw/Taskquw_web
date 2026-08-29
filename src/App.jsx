import { HashRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./LoginPage";
import Accounts from "./AccountsPage";
import SheetsPage from "./SheetsPage";
import CreateSheet from "./CreateSheet";
import SheetDetail from "./SheetDetail";
import SharedSheet from "./SharedSheet";
import Details from "./DetailsPage";
import ListLayoutEdit from "./ListLayoutEdit";
import TableLayoutEdit from "./TableLayoutEdit";
import TreeLayoutEdit from "./TreeLayoutEdit";
import { useState } from "react";
import HeaderComp from "./headercomp";
import AboutUs from "./AboutUs"

function App() {
  const [theme, setTheme] = useState("");

  const [huechecke, setHuechecke] = useState(false);
  const [hue, setHue] = useState(50);
  return (
    <div className={"theme"}>
      <div className="container1">
        <HashRouter>
          <Routes>
            <Route path="/" element={<LoginPage hue={hue} />} />
            <Route path="/sheets" element={<SheetsPage hue={hue} />} />
            <Route path="/accounts" element={<Accounts hue={hue} />} />
            <Route path="/create" element={<CreateSheet hue={hue} />} />
            <Route path="/sheet/:id" element={<SheetDetail hue={hue} />} />
            <Route path="/Share" element={<SharedSheet hue={hue} />} />
            <Route path="/Details" element={<Details hue={hue} />} />
            <Route path="/ListLayoutEdit" element={<ListLayoutEdit hue={hue} />} />
            <Route path="/TableLayoutEdit" element={<TableLayoutEdit hue={hue} />} />
            <Route path="/TreeLayoutEdit" element={<TreeLayoutEdit hue={hue} />} />
            <Route path="/AboutUs" element={<AboutUs />} />
          </Routes>
          <HeaderComp />
        </HashRouter>

      </div>
    </div>
  );
}

export default App;