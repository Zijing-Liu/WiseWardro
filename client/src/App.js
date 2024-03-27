import Header from "./components/Header/Header";
import Home from "./pages/Home/Home";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.scss";
import Recommendations from "./pages/Recommendations/Recommendations";
import MyOutfits from "./pages/MyOutfits/MyOutfits";
import MyClothes from "./pages/MyClothes/MyClothes";
function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/recommendationss" element={<Recommendations />} />
          <Route path="/my-outftis" element={<MyOutfits />} />
          <Route path="/my-clothes" element={<MyClothes />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
