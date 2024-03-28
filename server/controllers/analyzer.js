const express = require("express");
const OpenAIApi = require("openai"); // Import the OpenAI library
const { processImages } = require("./utils/processImages.js");
require("dotenv").config({ path: `${__dirname}/../.env` });
// Initialize the OpenAI API client
const openai = new OpenAIApi({ apiKey: process.env.OPENAI_API_KEY });

const analyzer = async (req, res) => {
  const selectedstyle = req.body.style;
  const imageUrls = await processImages(req);

  const formatExample = JSON.stringify([
    {
      outfit_id: 1,
      clothes: {
        3: "Beige trench coat, classic double-breasted with a belt",
        4: "Beige tailored trousers, plain front with a straight cut",
        0: "White button-up shirt, three-quarter sleeves with a classic collar",
      },
      score: 10,
    },
  ]);
  const textContent = `I have a collection of images, each showing a different piece of clothing. I need to create multiple outfits for a 25 to 30-year-old female in a ${selectedstyle} style. Based on these images, can you help me mix and match these clothes to form 3-5 outfits? Each outfit should be a combination of these pieces, suited for business casual attire.\nFor each outfit, provide a list that includes:\n- An outfit identifier (outfit_id) (auto-generated)\n- A short description of each piece of clothing in the outfit, including the category, color. the clothes_id is the index of the image provided in the collection\n - A score from 0 to 10, reflecting how well the outfit matches the Business Casual style.\n Your output should be JSON , in following format\n ${formatExample}`;
  const imagesContent = {
    ...imageUrls.map((url) => ({
      type: "image_url",
      imageUrls: { url: `data:image/jpeg;base64, ${url}`, detail: "low" },
    })),
  };
  const message = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: textContent,
        },
        imagesContent,
      ],
    },
  ];
  try {
    //     const response = await openai.chat.completions.create({
    //       model: "gpt-4-vision-preview",
    //       messages: [
    //         {
    //           role: "user",
    //           content: [
    //             {
    //               type: "text",
    //               text: textContent,
    //             },
    //             imagesContent,
    //           ],
    //         },
    //       ],
    //     });
    console.log(JSON.stringify(message));
    //res.send(response);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { analyzer };
