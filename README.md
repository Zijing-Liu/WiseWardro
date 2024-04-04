# WiseWardro

Have you ever stared at your closets, unsure of what to wear or if your outfit even matches your style? And what about mixing old favorites with new additions? It's a puzzle! But fear not, because that's where WiseWardro comes in! Checkout this video below that shows how simple it is to use WiseWardro.

## 🎥 Watch the Demo

<div align=”center” >
     <a href="https://www.youtube.com/watch?v=rqq_e4WpxgU">
       <img src="https://img.youtube.com/vi/pKMiv-bPQ00/0.jpg" alt="Demo of WiseWardro" width="640" height="auto" />
     </a>
</div>

## Tech stack

<div align=”center”>
<img  src="./readme_assets/WiseWardro_architect_bk.png" alt="Project Architecture and Tech Stack" width="400" height="auto"/>
</div>
<br>

- The project used **React.js, JavaScript, CSS, SASS** for the front-end development.
- For data persistence, we used **IndexDB** to store images and outfit combinations in the client side.
- The server and RESTful api was designed with **Node.js with Express.js**.
- The main feature of outfit suggestion was powpered by openAI API, GPT-4 vision model.

## 🔥 Key Features

- Drag and drop functionality for easy outfit creation.
- Style selection to customize recommendations.
- AI-powered advisor for expert fashion guidance.
- Save and favorite outfits for future reference.
- Seamless user experience with intuitive design.

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

## How to use WiseWardro

1. Drag and drop images and select style preference
   ![upload images](./readme_assets/upload_images.png)
   <br>
2. Get outfit inspirations
   <div style="display: flex; justify-content: space-between">
     <img  src="./readme_assets/recommendations.png" alt="get outfit ideas desktop view" height="320px" width="auto" style="margin-right: 10px;" />
     <img src="./readme_assets/recommendations_mobile.png" alt="get outfit ideas mobile view" height="320px"  width="auto" />
   </div>
<br>

3. Save an outfit as favorites
   ![save or remove an outfit](./readme_assets/fav_unfav_outfits.png)

<br>

4. check all saved outfits
   <br>
   ![my favorite outfits](./readme_assets/my-outfits.png)

## API references

**POST** (api/clothes): send a list of image files in the payload, get the resopnse from openAI open with messages of oufit advice.

External API reference[openai](https://platform.openai.com/docs/guides/vision)

## Lessons learned & next steps

- In order to get more accurate result, the prompt needs to be further refined.
- Currently the app uses IndexDB for client-side image storage, and images are communicate as form data between the client and server. Will implement cloud data storage for scaling purposes.
- Implement user profile feature, so we an get more specifics of each individual user, using this data to query gpt vision model, therefore to get more personalized fashion suggestions target to the user.
