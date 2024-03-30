import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useState } from "react";
import "./App.scss";
import Recommendations from "./pages/Recommendations/Recommendations";
import MyOutfits from "./pages/MyOutfits/MyOutfits";
import MyClothes from "./pages/MyClothes/MyClothes";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";
function App() {
  const [response, setResponse] = useState(null);
  return (
    <BrowserRouter>
      <Header />
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={<Home response={response} setResponse={setResponse} />}
          />
          <Route
            path="/recommendations"
            element={<Recommendations response={response} />}
          />
          <Route path="/my-outftis" element={<MyOutfits />} />
          <Route path="/my-clothes" element={<MyClothes />} />
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
