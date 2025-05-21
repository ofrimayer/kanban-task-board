# Kanban Task Board Full-Stack aApp

A Kanban-style task board with login, card saving, and light/dark mode toggle. This guide explains how to run the app with a local MongoDB database.

## 💻 Project Summary

A web-based task board that allows users to:
- Register/login (username + password)
- Add/move/delete task cards across "To Do", "Doing", and "Done" columns
- Toggle between light and dark mode (via themed icons)
- Save/load board state securely to MongoDB per user


## 🛠 Tech Stack

| Stack Layer | Technologies                                  |
| ----------- | --------------------------------------------- |
| Frontend    | HTML5, CSS3, JavaScript (Vanilla)             |
| Backend     | Node.js, Express.js                           |
| Database    | MongoDB, Mongoose                             |
| Auth        | Cookie-based session handling                 |
| Other       | Media queries, localStorage (mode preference) |

## 🧠 Features

* **Authentication:** Cookie-based login, optional 'Remember Me'.
* **Persistent Storage:** Tasks saved per user in MongoDB.
* **Interactive UI:** Drag and drop, live card editing, color picker.
* **Light/Dark Mode:** With dynamic text color adjustments.
* **Responsive Design:** Supports mobile and tablet screen sizes.

## 🗂️ Project Structure

```
/kanban-board
├── lib
│   ├── client
│   │   └── updater.js       # Frontend live reloader (dev only)
│   └── server
│       └── updater.js       # Backend live reloader (dev only)
├── public
│   ├── icons/               # Icons used across the UI
│   ├── app.js               # App class
│   ├── card.js              # Card component logic
│   ├── index.html           # Main task board
│   ├── index.js             # Entry point
│   ├── login.html           # Login page
│   ├── login.css            # Login page styles
│   ├── mover.js             # Drag and drop logic
│   ├── styles.css           # General styles
│   └── styles2.css          # Responsive + dark mode styles
├── server.js                # Express server setup and routes
├── models.js                # Mongoose models for users and tasks
├── .env                     # Environment variables (excluded from repo)
├── .gitignore               
├── package.json             # Project metadata and dependencies
├── package-lock.json        # Dependency lock file
├── README                   
```

## 📦 Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [Homebrew](https://brew.sh/) (for macOS)
- MongoDB Community Edition:
  ```bash
  brew tap mongodb/brew
  brew install mongodb-community@7.0
  brew services start mongodb-community@7.0
  ```

## 🛠 Setup Steps

### 1. Clone or unzip the project
```bash
cd path/to/project
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create MongoDB user and database
Open a new terminal and run:
```bash
mongosh
```
Then run the following inside the shell:
```js
use admin

db.createUser({
  user: "ofri",
  pwd: "mypassword",
  roles: [{ role: "readWrite", db: "taskboard" }]
})

use taskboard

db.users.insertOne({ user: "ofri", password: "mypassword" })
```

### 4. Add your environment variables
Create a file named .env in the project root:
```js
MONGO_URI=mongodb://ofri:mypassword@localhost:27017/taskboard?authSource=admin
```

### 5. Enable dotenv in `server.js`
At the top of your server.js file, add:
```js
import dotenv from "dotenv";
dotenv.config();
```
Then replace the hardcoded connection string:
```js
await mongoose.connect(process.env.MONGO_URI);
```

### 6. Start the server
```bash
node server.js
```
You should see:
```
Connected to MongoDB
Server started. Now open http://localhost:1930/ in your browser.
```

## 🚀 Usage

### Login
Go to [http://localhost:1930/](http://localhost:1930/) and log in with:
- **Username:** ofri
- **Password:** mypassword

### Features
- Create, move, and delete cards across columns
- Save/load board state to MongoDB
- Toggle between light/dark mode (check `icons/` for toggle icons)
- Cookie-based login with optional "Remember Me"


## 🔐 Disclaimer
This project was developed as part of a university web development course. The implementation follows assignment requirements and is intended solely for educational and demonstration purposes.

Use of this code for academic submissions by others is not permitted. While I implemented the full functionality, I do not claim ownership of the original idea or assignment design.

Note: This project uses plain-text passwords and is not production-ready. Security best practices (such as password hashing and input validation) should be added before any real-world use.


