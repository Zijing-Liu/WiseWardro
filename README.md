# WiseWardro

![Homepage](./readme_assets/homepage.png)

## Tech stack

- The project used **React.js, JavaScript, CSS, SASS** for the front-end development.
- For data persistence, we used **IndexDB** to store images and outfit combinations in the client side.
- The server and RESTful api was designed with **Node.js with Express.js**.
- The main feature of outfit suggestion was powpered by openAI gpt4 vision API.

![Project Architecture and Tech Stack](./readme_assets/WiseWardro_architect_bk.png)

## Features and/or usage instructions

1. Uploads images with drags and drop, and selected styles before consuliting outfit ideas
   ![upload images](./readme_assets/upload_images.png)

2. Get outfit inspirations
   <div style="display: flex; justify-content: space-between">
     <img  src="./readme_assets/recommendations.png" alt="get outfit ideas desktop view" height="320px" width="auto" style="margin-right: 10px;" />
     <img src="./readme_assets/recommendations_mobile.png" alt="get outfit ideas mobile view" height="320px"  width="auto" />
   </div>
3. Save an outfit as favorites
   ![save or remove an outfit](./readme_assets/fav_unfav_outfits.png)

4. check all saved outfits
   ![my favorite outfits](./readme_assets/my-outfits.png)

## Installation

1. Clone the project repository:

   ```bash
   git clone [https://github.com/Zijing-Liu/InStock-finch-client.git]
   ```

2. Install all dependencies in both client directory and server directory

   ```bash
   npm install
   ```

3. Start the client

   ```bash
   npm start
   ```

4. Start the server:
   ```bash
   node index.js
   ```

## API references

**POST** (api/clothes): send a list of image files in the payload, get the resopnse from openAI open with messages of oufit advice.

External API reference[openai](https://platform.openai.com/docs/guides/vision)

## Lessons learned & next steps

- In order to get more accurated result, the prompt needs to be further refined.
- Currently the app uses IndexDB for client-side image storage, and images are comminicated as formdata between the client and server. Will implement cloud data storage for scaling purposes.
- Implement user profile feature, so we an get more spes of each individual user, using this data to query gpt vison model, therefore to get more personalized fashion suggestions targert to the uesr.
