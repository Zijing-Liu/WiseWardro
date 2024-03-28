const e = require("express");
const OpenAIApi = require("openai"); // Import the OpenAI library
require("dotenv").config({ path: `${__dirname}/../.env` });
// Initialize the OpenAI API client
const openai = new OpenAIApi({ apiKey: process.env.OPENAI_API_KEY });

const analyzer = async (req, res, next) => {
  const selectedstyle = req.body.style;
  const imageUrls = [];
  Object.keys(req.files).forEach((key) => {
    const file = req.files[key];
    // Assuming the images are JPEGs. Adjust the MIME type if they're not.
    const base64String = `data:image/jpeg;base64,${file.data.toString(
      "base64"
    )}`;
    imageUrls.push(base64String);
  });

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

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: textContent,
            },
            ...imageUrls.map((image_url) => ({
              type: "image_url",
              image_url: image_url,
            })),
          ],
        },
      ],
    });
    console.log(response[0]);
    res.send(response);
  } catch (error) {
    console.log(error);
  }
  next();
};

module.exports = { analyzer };
