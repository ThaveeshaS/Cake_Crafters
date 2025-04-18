# Cake_Crafters

## Overview
CakeCrafters is an innovative online platform designed for cake enthusiasts to share, learn, and grow their cake-making skills. Whether you're a beginner or an experienced baker, CakeCrafters provides a space to showcase your creations, exchange recipes, and explore new techniques. The platform includes features like user profiles, cake posts, recipe management, decorating tips, and community engagement, all secured with OAuth 2.0 authentication.

## Key Features
- **User Profile Management**: Create, read, update, and delete profiles with personalized information and activity tracking.
- **Cake Post Creation and Interaction**: Share cake posts with photos or videos, and interact with others through likes and comments.
- **Cake Recipe Management**: Upload, save, and manage detailed recipes with ingredients and step-by-step instructions.
- **Decorating Tips & Tricks**: Share and browse decorating tips categorized by difficulty, tags, or themes.
- **Authentication & Authorization**: Secure login via OAuth 2.0 (Google, Facebook).
- **Notifications**: Real-time alerts for likes, comments, and new followers.
- **Voice Navigation**: A novel feature that allows users to navigate the platform using voice commands for a hands-free experience.

## Technologies Used
- **Frontend**: React JS with Redux for state management.
- **Backend**: REST API built with Spring Boot.
- **Database**: Firebase for real-time data storage and synchronization.
- **Authentication**: OAuth 2.0 for secure user login.
- **Voice Navigation**: Integrated voice command functionality for enhanced accessibility.

## System Architecture
The system follows a client-server architecture:
- **Client**: React JS application with components for UI, middleware for API calls, and Redux for state management.
- **Server**: Spring Boot REST API handling CRUD operations, authentication, and business logic.
- **Database**: Firebase for storing user data, posts, recipes, and tips.

## Setup Instructions
### Prerequisites
- Node.js and npm for frontend development.
- Java and Spring Boot for backend development.
- Firebase account for database setup.

### Installation
1. **Clone Project**:
   ```bash
   git clone https://github.com/ThaveeshaS/Cake_Crafters.git
    ```

1. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm start
    ```
2. **Backend**:
    ```bash
   cd backend
   ./mvnw spring-boot:run 
     ```
3. **Environment Variables**
- Create firebase-service-account.json under resources and add Firebase credentials.

## Usage
1. **Sign Up/Login**: Use OAuth 2.0 to log in via Google or Facebook.

2. **Create a Post**: Upload photos/videos of your cake and add a description.

3. **Share Recipes**: Add ingredients and instructions for your cake recipes.

4. **Browse Tips**: Explore decorating tips by category or difficulty.

5. **Voice Navigation**: Use voice commands to navigate the platform (e.g., "Go to recipes," "Show my profile").

## Contributors
- Pasindu W.G.V (IT22273512) 

- Sanjana K.G.T.S (IT22224170)

- Viduranga S.P.S (IT22215192)

- Chandraguptha H.A.T (IT22091970)
