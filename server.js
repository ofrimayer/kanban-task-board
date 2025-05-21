import express from "express";
import http from "http";
import path from "path";

import mongoose from "mongoose";
import { User, Note } from "./models.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 1930;

const app = express();
const server = http.createServer(app);

const publicPath = path.join(__dirname, "public");

// middleware stuff
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


// basic test for debugging
app.get("/test-basic-route", (req, res) => {
  res.send("Basic route is working!");
});

// db test for debugging
app.get("/test-db-connection", async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    res.send(`MongoDB is connected. User count: ${userCount}`);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    res.status(500).send("Error connecting to MongoDB");
  }
});

// serving login page at the root
app.get("/", (req, res) => {
  console.log("GET / - checking authentication");
  if (req.cookies && req.cookies.login) {
    console.log("User authenticated, redirecting to /notes");
    res.redirect("/notes");
  } else {
    console.log("User not authenticated, serving login.html");
    res.sendFile(path.join(publicPath, "login.html"));
  }
});

// login form submission
app.post("/", async (req, res) => {
  const { username, password, rememberMe } = req.body;
  const user = await User.findOne({ user: username, password: password });
  if (user) {
    if (rememberMe) {
      res.cookie("login", username, { httpOnly: true });
    }
    res.redirect("/notes");
  } else {
    res.redirect("/?error=true");
  }
});

// authentication for /notes
// if the user doesn't click remember me, they can get to /notes without a cookie
app.use("/notes", (req, res, next) => {
  console.log("Checking authentication");
  if (req.cookies && req.cookies.login) {
    next(); // proceed
  } else if (req.get('Referer') && req.get('Referer').endsWith('/')) { // checking if the req to /notes route came from the login page (root url)
    next(); // proceed
  } else {
    res.redirect("/");
  }
});

// if user is logged in - serving /notes
app.get("/notes", (req, res) => {
  console.log("GET /notes - serving index.html");
  res.sendFile(path.join(publicPath, "index.html"));
});

// logout
app.post("/logout", (req, res) => {
  console.log('Logout');
  res.clearCookie("login");
  res.status(200).send();
});

// saving without using localStorage
app.post("/saveBoard", async (req, res) => {
  const username = req.cookies.login || req.body.username; // username is fetched from the cookie or from the body of the request
  const boardState = req.body;
  // filtering and mapping cards to appropriate columns
  try {
    const todoCards = boardState.filter(card => card.colId === "todo").map(card => ({
      title: card.title,
      desc: card.description,
      color: card.color,
      index: card.index
    }));
    const doingCards = boardState.filter(card => card.colId === "doing").map(card => ({
      title: card.title,
      desc: card.description,
      color: card.color,
      index: card.index
    }));
    const doneCards = boardState.filter(card => card.colId === "done").map(card => ({
      title: card.title,
      desc: card.description,
      color: card.color,
      index: card.index
    }));

    await Note.updateOne(
      { username },
      { $set: { todo: todoCards, doing: doingCards, done: doneCards } },
      { upsert: true }
    );
    res.status(200).send("Board state saved");
  } catch (error) {
    console.error("Error saving board state:", error);
    res.status(500).send("Error saving board state");
  }
});

// loading without using localStorage
app.get("/loadBoard", async (req, res) => {
  const username = req.cookies.login || req.body.username; // username is fetched from the cookie or from the body of the request
  try {
    const note = await Note.findOne({ username });
    const boardState = [];
    if (note) {
      ["todo", "doing", "done"].forEach(colId => {
        note[colId].forEach(card => {
          boardState.push({ colId, title: card.title, description: card.desc, color: card.color, id: card._id });
        });
      });
    }
    res.json(boardState);
  } catch (error) {
    console.error("Error loading board state:", error);
    res.status(500).send("Error loading board state");
  }
});

console.log(`Serving files from ${publicPath}`);
app.use("/lib/client", express.static(path.join(__dirname, "lib", "client")));
app.use(express.static(publicPath));

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    server.listen(PORT, () => {
      console.log(`Server started. Now open http://localhost:${PORT}/ in your browser.`);
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};

start();