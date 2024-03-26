# WiseWardro

Your Personal AI Stylist for Effortless Outfit Coordination

## Overview

A mobile app that utilized GPT4 to analyze and suggests clothing that matches your current wardrobe.

### Problem

The app addresses the following pain points:

Users having trouble knowing if new clothing will match their existing wardrobe.
Minimalists wanting to maximize styles from a minimal amount of clothing.

### User Profile

Who will use it?

- People of all ages and genders who look for professional and personalized styling advice with near-free costs.
- Shoppers who have trouble knowing whether a new piece of clothing they are interested in will fit or match their existing clothing.
- Minimalists who aim to have the most styles out of the minimum amount of clothing.
- Young students or professionals who want to save costs on clothing without sacrificing fashion.

How will users use the app?

- Users will upload their old clothing images and new clothing images they are interested, set style preferences, and receive AI-generated outfit recommendations for effortless styling.

Special Considerations

- Ensure user-friendly design, prioritize privacy and security, cater to diverse preferences, and plan for scalability as the user base grows.

### Features

**User SignUp/Login**: Support users to create a profile, login with email and password.

**User Profile**: Overview of user account information, allowing user to set up their style preference, and retrivew the list of favorite outfits.

**Clothing Uploader**: Allow users to upload images of their existing clothing items into the app.

**Image Property Extration**: Extrat the features of user-uploaded image, including colors and descriptive labels.

**AI Matching Algorithm**: An AI-powered recommendation system that analyzes colors, styles, and patterns to suggest complementary clothing items from exisiting images in database.

**Outfit gallery**: display a list of colthing in gallery view that matches with a piece of clothing uploaded from user.

**Save and Retrive**: Allow users to save their favorite outfits and retrive them in the favorite list.

## Implementation

### Tech Stack

- Front-end: React.js, JavaScript, SASS, HTML5
- Server and API: Node.js, Express.js, validator.js
- Database: MySQL, knex.js
- Authentication and Authorization: JWT

### APIs

- OpenAI GPT-4 Vision API

### Sitemap

- Home/Login/SignUp
- Home/Outfit Gallery
- Home/Clothing Uploader/AI Matching Results
- Profile/Settings
- Profile/Favorites List

### Mockups

On going

### Data

The app will store user profiles, clothing, AI analysis results, and recommended outfits. The object model below describes the relationships between data objects.

![Object Model](/ObjectModel.jpg)

### Endpoints

List endpoints that your server will implement, including HTTP methods, parameters, and example responses.

- **GET** /api/outfits. Return all outfits in the databse.
- **GET** /api/outfits/:occassion. Return the outfits that matches with a occassion specified by the user.
- **POST** /api/clothes. Add a new clothes object to the database.
- **GET** /api/clothes/:id. Get a piece of clothes matching the id.

### Auth

The project will use JWT for authentication.
For the client side, generate the JWT token upon account registration, store JWT T
For the server side, use server session to verify user and control access to data.

## Roadmap

- March 20 - March22 (Sprint 0 - Test GPT4 Turbo with Vision)

- March 25 (Sprint 1 - User Authentication and Profile Setup)

- March 26-27 (Sprint 2 - Image Upload and GPT-4 Vision API Integration):

- March 28 (Sprint 3 - Generate the prompts to get desired results from GPT4):

- March 29 (Sprint 4 - Outfit Gallery and Favorites List):

- March 30 (Sprint 5 - Save and Retrieve Functionality):

- March 31 (Sprint 6 - Testing):

## Nice-to-haves

**Recommend clothings from ecommence sites**: Fetch current clothings from mainstream ecommence site and recommend clothings from this data source.

**Shopping Integration**: Integrate with e-commerce platforms to facilitate seamless purchasing of recommended clothing items directly through the app.

**Personalized Recommendations**: Provide users with personalized recommendations based on their skin color, style preferences, body type, and previous purchases.

Feedback Loop: Incorporate a feedback mechanism where users can rate suggested outfits and provide feedback to improve the accuracy of future recommendations.
