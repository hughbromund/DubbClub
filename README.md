<p align="center">
<img src="./DubbClubWordmark.png" alt="Dubb Club Logo" width="70%" />
</p>

# DubbClub

# [Hosted Website](https://dubb.club)

# [iOS Companion Repository](https://github.com/Dubb-Club-iOS/Dubb-Club-iOS-App)

# Problem Statement

For avid sports fans, it can be difficult to find information about statistics and probabilities for your favorite teams without paying or wading through piles of non-information. We want to provide a service that uses well-respected data sources and models to aggregate statistics and provide sports predictions for free.

# Project Objectives

- Build a robust web application which displays accurate predictions for winners of upcoming sports games.
- Provide the ability to create an account on the above website and track selected teams.
- Develop a custom machine learning algorithm to predict game outcomes based on pre-game data.
- Store team and prediction data in a database to reduce API calls.
- Host a fully functioning website that is accessible from the web.
- Track games in real time and get updated predictions and statistics while the games are progressing.
- Provide ancillary information about the sporting events and the participating teams.

# Features

## Tools

- JavaScript
- Python
- Node.js
- Express.js
- React.js
- MongoDB
- Google Cloud

# The Team

## Frontend

- Hugh
- Nate

## Backend

- Peyton
- Daniel

## Machine Learning

- Aditya

# How to Run

1. Clone the Repo
2. Run `./install.sh`
   1. This will install all dependencies for both the frontend and the backend
3. Run `pip install -r requirements.txt` in `/alderaan`, `/mustafar`, and `/hoth`
   1. This will install all dependencies for the python services
4. Run `npm run start` in the root to start the frontend and backend
5. Navigate to `localhost:3000`

Note: Code additionally requires a config file in the following format to be placed in `/backend`

    {
        "databaseURI" : "",
        "secret" : "",
        "email_service": "",
        "email_user": "",
        "email_pass": "",
        "nbaApiKey": "",
        "TWILIO_ACCOUNT_SID": "",
        "TWILIO_AUTH_TOKEN": "",
        "TWILIO_PHONE_NUMBER": ""
    }

# File Structure

## `/frontend`

The `/frontend` directory holds all files related to the running and deployment of the web application.

- `/src/components` holds all custom React components for the frontend
- `/src/assets` holds all static assets that are used on the frontend like team logos, and the DubbClub logo

## `/backend`

The `/backend` directory holds all files related to backend web service which supports the website.

- `/src/services` contains the majority of all logic for the website’s functionality, including all sports features, authentication, and connection with servers running ML processes.
- `/src/database/models` contains our database schemas.

## `/alderaan`

The `/alderaan` directory holds all files for **EPL** predictions (models, training data, and microservice).

## `/hoth`

The `/hoth` directory holds all files for **MLB** predictions (models, training data, and microservice).

## `/mustafar`

The `/mustafar` directory holds all files for **NBA** predictions (models, training data, and microservice).

# License

This project is Licensed under the **GNU General Public License v3.0.**
