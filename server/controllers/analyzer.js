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
      outfit_id: 0,
      clothes: ["image1", "image2", "image3"],
      score: 10,
      considerations: "",
    },
  ]);
  const textContent = `I have a collection of images encoded in base64, they are ${imageUrls}, each showing a different piece of clothing. I need to create multiple outfits for a 25 to 30-year-old female in a ${selectedstyle} style. Based on these images, first analyze the images based on color, style, texture,  then mix and match these clothes to form 1-5 outfits. Each outfit should be a combination of these pieces, suited for  ${selectedstyle} attire.\nFor each outfit, provide a list that includes:\n- An outfit identifier (outfit_id) (auto-generated)\n- A short description of each piece of clothing in the outfit, including the category, color. the clothes_id is the index of the image provided in the collection\n - A score from 0 to 10, reflecting how well the outfit matches the Business Casual style.\n Your output should be JSON , in following format\n ${formatExample}.`;
  const imagesContent = imageUrls.map((url) => ({
    type: "image_url",
    image_url: {
      url: url,
      detail: "low",
    },
  }));

  const message = [
    {
      role: "user",
      content: [
        {
          type: "text",
          text: textContent,
        },
        ...imagesContent,
      ],
    },
  ];

  console.log(JSON.stringify(message));

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: message,
    });
    console.log(response.choices[0]);
    res.status(200).json(response.choices[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: `Error calling gpt4 api: ${error}` });
  }
};

module.exports = { analyzer };
