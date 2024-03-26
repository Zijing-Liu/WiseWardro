// import OpenAI from "openai";
// Import the OpenAI library
const OpenAIApi = require("openai");
const fs = require("fs");
require("dotenv").config({ path: `${__dirname}/../.env` });
// Initialize the OpenAI API client
const openai = new OpenAIApi({ apiKey: process.env.OPENAI_API_KEY });

async function main() {
  const image1Path = "../../images/f23_04_a08_114459_1274_off_a.jpg";
  const image2Path = "../../images/s24_00_a04_112244_6162_off_a.jpg";

  // Read and encode the images in Base64
  const image1Base64 = fs.readFileSync(image1Path, { encoding: "base64" });
  const image2Base64 = fs.readFileSync(image2Path, { encoding: "base64" });

  const response = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `I have two pieces of clothing as shown in the attached image files. Can you tell if they are a good match for a 25-30-year-old female under the guideline of creating a balance between professionalism and trendiness?`,
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
  console.log(response.choices[0]);
}
main();
