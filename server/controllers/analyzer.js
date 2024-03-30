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
    {
      outfit_id: 1,
      clothes: ["image4", "image5", "image6"],
      score: 9,
      considerations: "",
    },
  ]);
  const textContent = `I have a collection of images encoded in base64 ${imageUrls} , each showing a different piece of clothing. I need to assemble various outfits for a 25 to 40-year-old female in the ${selectedstyle} style. Using these images, can you help me compile 1 or more outfits based on the total number of images provided where each type of clothing item (like a jacket) appears only once per outfit? 

  For each outfit, please provide:
  - An automatically generated outfit identifier (outfit_id).
  - A list of clothes, represented by their image ids, selected for the outfit.
  - A score from 0 to 10, indicating how well the outfit aligns with the ${selectedstyle} style.
  - A brief explanation of your choices, focusing on style coherence and your expertise in female fashion.
  
  The output should be in the format of a list of JSON objects, similar to: ${formatExample}`;
  const imagesContent = imageUrls.map((url) => ({
    type: "image_url",
    image_url: {
      url: url,
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
