import React, { useState } from "react";
import "./Home.scss";
import ImageUploader from "../../components/ImageUploader/ImageUploader";
const Home = () => {
  return (
    <div>
      <h1 className="home__heading">Ask the AI stylist</h1>
      <ImageUploader />
    </div>
  );
};

export default Home;
