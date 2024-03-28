const OpenAIApi = require("openai"); // Import the OpenAI library

require("dotenv").config({ path: `${__dirname}/../.env` });
// Initialize the OpenAI API client
const openai = new OpenAIApi({ apiKey: process.env.OPENAI_API_KEY });
const path = require("path");

// // Function to get all image URLs from the folder
// function getImageUrls(directory, baseUrl) {
//   fs.readdir(directory, (err, files) => {
//     if (err) {
//       next(err);
//       return;
//     }

//     const imageUrls = files
//       .filter((file) => /\.(jpg|jpeg|png|gif)$/i.test(file))
//       .map((file) => path.join(baseUrl, file));

//     return imageUrls;
//   });
// }

const analyzer = async (req, res, next) => {
  // read image from the req
  console.log(req.body);
  if (!req.body) {
    return res.status(400).json({
      message: "please provide the images and a style",
    });
  }
  // req.body.iamges;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `I have a list of images ${req.body.iamges}, and I want to style outfits base Can you tell if they are a good match for a 25-30-year-old female under the guideline of creating a balance between professionalism and trendiness?`,
            },
            {
              type: "image_url",
              image_url: `data:image/jpeg;base64,${image1Base64}`,
            },
            {
              type: "image_url",
              image_url: `data:image/jpeg;base64,${image2Base64}`,
            },
          ],
        },
      ],
    });
  } catch (error) {}

  console.log(response.choices[0]);
  next();
};

module.exports = { analyzer };
