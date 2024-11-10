# User Dashboard Application

## Overview

This is a **User Dashboard Application** designed to provide an interactive platform where users can register, log in, manage their profiles, and engage in social features like managing friend lists and viewing activity feeds. Built with **ReactJS** on the frontend, and **Python FastAPI** on the backend, this application is powered by **MongoDB** for data storage and is dockerized for easy deployment.

## Features

### 1. **User Authentication**
- **Login Page:** Allows users to authenticate using their credentials. Displays error messages for incorrect login attempts.
- **Registration Page:** Users can register with password confirmation and validation.
  
### 2. **Dashboard**
- **Home Page (Activity Feed):** Displays a feed showing the most recent activities and events related to the user.
- **Profile Page:** View and update personal profile details such as name, email, and profile picture.
  
### 3. **Friend System**
- **Friends Page:** View the list of friends and accept or reject friend requests.
- **Find Page:** Search for other users within the platform to send friend requests.

### 4. **Database Integration**
- The user data (including usernames, passwords, profiles, activity logs, and friend lists) are stored in **MongoDB**, ensuring efficient storage and retrieval.

### 5. **Dockerization**
- The entire application is **dockerized**, making it easy to set up and deploy using Docker with just a few commands.

### 6. **Session Management with Redis**
- **Session Handling:** Redis is used for managing user sessions, ensuring fast and efficient session storage and retrieval. This improves the performance of user authentication and state management across different sessions.

---

## Steps to Run the Project

Follow the steps below to run this project locally on your machine:

1. **Install Docker**  
   Ensure Docker is installed on your system. 

2. **Run the Application**  

- Install Docker in your system
- Run this single command 

```python
docker compose build
docker compose up
```

Env Configurations : 
Two env file is needed 

Frontend Env Template
it should be inside frontend/.env
```.env
REACT_APP_API_URL=/api
```

.env in the root directory
```.env
MONGO_URI=mongodb://mongodb:27017
REDIS_HOST=redis 
REDIS_PORT=6379

AWS_KEY=""
AWS_SKEY=""
AWS_REGION=""
AWS_BUCKET_NAME=""
```