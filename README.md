# Installation Guide for the Client Data Interface

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

### Backend
1. In the terminal, navigate to the backend folder located at `ClientData/src/backend`.
2. Run the same command to install the backend dependencies:
   ```bash
   npm install
   ```

## 3. Running the Application

### Frontend (ClientData)
1. In one terminal, navigate to the `ClientData` path.
2. Run the following command to start the client interface:
   ```bash
   npm start
   ```
   This will start the development server and the app will be available at `http://localhost:3000`.

### Backend (Server)
1. In a second terminal, navigate to the `ClientData/src/backend` path.
2. Run the following command to start the server:
   ```bash
   node server.js
   ```
   Once started, the backend server will be running on `http://localhost:5000`.

## 4. Connecting to MySQL

1. Set up your MySQL database and create the necessary tables.
2. In `server.js`, update the connection details (username and password) with your own MySQL credentials.

> *Note:* In future versions, this process will be automated, and no manual MySQL connection setup will be required.

---

This guide will help you get the Client Data interface up and running locally. If you encounter any issues or need further clarification, feel free to reach out.
