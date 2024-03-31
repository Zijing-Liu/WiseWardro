import React, { useState, useEffect } from "react";
import "./StartStyling.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { hasImages, clearImages, storeImages } from "../../utils/indexDB";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
const StartStyling = ({ style, setStyle, response, setResponse, images }) => {
  const [errors, setErrors] = useState({});
  const [request, setRequest] = useState(false);
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
      if (hasImages) {
        try {
          await clearImages();
          console.log("Images cleared successfully.");
        } catch (error) {
          console.error("Failed to clear history images:", error);
          setErrors((prevErrors) => ({
            ...prevErrors,
            db: "Failed to clear history images, please try again",
          }));
        }
      }
    };

    clearDatabase();
  }, []);
  useEffect(() => {
    if (response.length > 0 && request) {
      navigate("/recommendations");
      setApiCallFinished(false); // Reset the flag after navigating
    }
  }, [response, apiCallFinished, navigate]); // re-render the page when the response is upadated

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
      // console.log(`Sending request to ${base_url}/clothes`);
      await storeImages(images, formDataKeys); // store images in IndexedDB
      // const apiResponse = await axios.post(`${base_url}/clothes`, formData); // send formData to api
      // console.log("Response from GPT-4:", apiResponse.data.message.content);
      // setResponse(apiResponse.data.message.content);
      // setRequest(false); // Reset request state
      // setApiCallFinished(true); // Indicate API call is finished
      setTimeout(() => {
        setResponse(
          "Based on the images provided, I can compile a single outfit that aligns with an Elegant style for a 25 to 40-year-old female. Since there is only one piece per clothing item type, there will be one outfit. Here's the outfit breakdown:\n" +
            "\n" +
            "[{\n" +
            '"outfit_id":0,\n' +
            '"clothes":["image1","image2","image3","image4"],\n' +
            '"score":8,\n' +
            '"considerations":"The outfit consists of classic black shoes, which are a timeless element of elegant fashion. The wide-legged denim trousers offer a contemporary twist that can still fit within sophisticated attire if styled correctly. The white shirt provides a crisp and clean look that is versatile for elegant styling. Lastly, the trench coat adds a refined and polished finish to the ensemble, contributing to the overall elegance. The combination is cohesive and modern while adhering to the principles of elegant style, hence the score of 8. The only point of contention that prevents a full score is the casual nature of the denim, which is not always associated with high elegance but can be elevated with the right accessories and shoes."\n' +
            "}]"
        );
        setRequest(false); // Reset request state
        setApiCallFinished(true); // Indicate API call is finished
      }, 5000);
    } catch (error) {
      console.error("Error in sending request:", error);
      setErrors({ api: `${error}. Please try again.` });
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
      </div>
    </div>
  );
};

export default StartStyling;
