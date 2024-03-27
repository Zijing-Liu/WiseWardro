import React, { useState } from "react";
import "./StartStyling";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
const AnalyzeImages = () => {
  const base_url = process.env.REACT_APP_BASE_URL;
  console.log(base_url);
  // const navigate = useNavigate();
  const [selectedStyle, setSelectedStyle] = useState(null);
  const styles = [
    "Streetwear",
    "Boho-chic",
    "Casual",
    "Business Casual",
    "Formal",
    "Minimalist",
    "Elegant",
    "Athleisure",
    "Girly girl",
    "NYC Style",
    "Preepy Fashion",
    "Punk Fashion",
    "Gothic Fashion",
  ];

  const handleStyleClick = (style) => {
    setSelectedStyle(style);
  };

  // const handleClick = async () => {
  //   if (!selectedStyle) {
  //     alert("Please selected a style for your outfit");
  //   }
  //   try {
  //     // send styling options to api call
  //     const response = await axios.post(`${base_url}/clothes`, {
  //       style: selectedStyle,
  //     });
  //     console.log(response);
  //     // navigate("/recommendations");
  //   } catch (error) {
  //     console.log("error message ", error);
  //   }
  // };

  return (
    <div className="style">
      <div className="style__options">
        {styles.map((style) => (
          <button
            key={style}
            className={`style__option ${
              selectedStyle === style ? "style__option--selected" : ""
            }`}
            onClick={() => handleStyleClick(style)}
          >
            {style}
          </button>
        ))}
      </div>

      <button className="style__btn">Start Styling</button>
    </div>
  );
};

export default AnalyzeImages;
