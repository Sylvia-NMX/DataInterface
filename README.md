# Installation Guide for the Client Data Interface

## Disclaimer: 
This repository contains the un-built version of the app which means that this version will only work on localhost. The backend is no longer operable due to the fact that the connection to the corresponding database is made by an event with the submit button and it is connected through an api deployed in a virtual server. The backend folder is left as a version control and for future references if needed. The built version will have changes in connection and security which is why it is recommened to use this repository as a consultation resource. 

## 1. Download or Clone the Repository
- You can either download the project as a `.zip` file or clone the repository to your local machine.

## 2. Install Dependencies
### Client Interface
1. Open your terminal.
2. Navigate to the `ClientData` directory.
3. Run the following command to install the required npm modules:
   ```bash
   npm install
   ```
   This will create a `node_modules` folder based on the `package.json` file.

## 2. Running the Application

### Frontend (ClientData)
1. In one terminal, navigate to the `ClientData` path.
2. Run the following command to start the client interface:
   ```bash
   npm start
   ```
   This will start the development server and the app will be available at `http://localhost:3000`.
## Note:
To understand better the paths and folders inside this app, please look for the `directory.md` file inside `ClientData/src/assets`

This guide will help you get the Client Data interface up and running locally. If you encounter any issues or need further clarification, feel free to reach out.
