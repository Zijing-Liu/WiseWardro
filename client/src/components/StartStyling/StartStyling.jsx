import React, { useState, useEffect } from "react";
import "./StartStyling.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { hasImages, clearImages, storeImages } from "../../utils/indexDB";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
const StartStyling = ({ style, setStyle, response, setResponse, images }) => {
  const [errors, setErrors] = useState({});
  const [request, setRequest] = useState(false); // the loading state
  const [apiCallFinished, setApiCallFinished] = useState(false);

  const base_url = process.env.REACT_APP_BASE_URL;
  const navigate = useNavigate();
  const handleStyleClick = (style) => {
    setStyle(style);
  };

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
  //clear out the old images stored in indexDB upon reload of this page
  useEffect(() => {
    const clearDatabase = async () => {
      try {
        const ImagesStoreHasData = await hasImages();
        if (!ImagesStoreHasData) {
          return;
        }
        await clearImages();
      } catch (error) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          db: "Failed to clear history images, please try again",
        }));
      }
    };
    clearDatabase();
  }, []);
  useEffect(() => {
    if (apiCallFinished && response.length > 0) {
      // ensure gpt4 has send back meaningful resonse
      navigate("/recommendations");
      setApiCallFinished(false); // Reset the flag after navigating
    }
  }, [apiCallFinished]); // re-render the page when the response is upadated

  const handleClick = async () => {
    const errors = {};
    if (!style) {
      errors.style = "Please selected a style for your outfit";
    }
    if (!images || images.length < 3) {
      errors.images = "Please upload at least 3 images";
    }
    if (errors.images || images.style) {
      setErrors(errors);
      return;
    }
    setRequest(true);
    setErrors({}); // Clear previous errors
    // construct the formdata to include image files and the selected style
    const formData = new FormData();
    const formDataKeys = [];
    images.forEach((image, index) => {
      formData.append(`image${index}`, image.file);
      formDataKeys.push(`image${index}`);
    });
    formData.append("style", style);

    try {
      await storeImages(images, formDataKeys); // store images in IndexedDB
      // const apiResponse = await axios.post(`${base_url}/clothes`, formData); // send formData to api
      // setResponse(apiResponse.data.message.content);
      setRequest(false); // Reset request state
      setApiCallFinished(true); // Indicate API call is finished
    } catch (error) {
      console.error("Error in sending request:", error);
      setErrors({ api: `${error.message}. Please try again.` });
    }
  };

  return (
    <div className="style">
      <div className="style__options">
        {styles.map((s) => (
          <button
            key={s}
            className={`style__option ${
              s === style ? "style__option--selected" : ""
            }`}
            onClick={() => handleStyleClick(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {!request && (
        <button className="style__btn" onClick={handleClick}>
          Ask Advisor
        </button>
      )}
      {request && (
        <Box className="style__loading" sx={{ display: "flex" }}>
          <CircularProgress sx={{ color: "black" }} />
        </Box>
      )}
      <div className="" style__errors>
        {errors.images && <p className="error">{errors.images}</p>}
        {errors.style && <p className="error">{errors.style}</p>}
        {errors.api && <p className="error">{errors.api}</p>}
        {errors.db && <p className="error">{errors.db}</p>}
      </div>
    </div>
  );
};

export default StartStyling;
