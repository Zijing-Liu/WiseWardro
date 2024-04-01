import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import "./App.scss";
import Recommendations from "./pages/Recommendations/Recommendations";
import MyOutfits from "./pages/MyOutfits/MyOutfits";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import Home from "./pages/Home/Home";

function App() {
  // the message string obtained from gpt4 api, a global state shared between the recommendation page and the homepage
  const [response, setResponse] = useState("");
  const [style, setStyle] = useState("");
  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="app__main">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  response={response}
                  setResponse={setResponse}
                  style={style}
                  setStyle={setStyle}
                />
              }
            />
            <Route
              path="/recommendations"
              element={
                <Recommendations
                  response={response}
                  setResponse={setResponse}
                  style={style}
                />
              }
            />
            <Route path="/my-outftis" element={<MyOutfits />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
