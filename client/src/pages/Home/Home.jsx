import React, { useState } from "react";
import "./Home.scss";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
const Home = ({ response, setResponse }) => {
  console.log("homepage", response);
  return (
    <div>
      <h1 className="home__heading">Ask the AI stylist</h1>
      <ImageUploader setResponse={setResponse} />
    </div>
  );
};

export default Home;
