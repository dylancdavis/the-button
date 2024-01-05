// const express = require("express");
import express from "express";
const app = express();
const port = 8000;

import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";

app.use(express.static("build"));

app.use(express.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/data", (req, res) => {
  const db = new LowSync(new JSONFileSync("db.json"), {});
  db.read();
  res.send(JSON.stringify(db.data));
});

app.post("/click", (req, res) => {
  const db = new LowSync(new JSONFileSync("db.json"), {});
  const bodyData = req.body;
  db.read();
  const users = db.data.users;
  const user = users.find(({ userID }) => userID === bodyData.userID);
  if (user) {
    // User already exists.
    // Ignore if new score is less.
    if (bodyData.score < user.score) {
      res.send(db.data);
      return;
    }
    user.score = bodyData.score;
  } else {
    // Create new user
    users.push(bodyData);
  }
  db.data.totalClicks++;
  db.data.mostRecentClick = new Date();
  db.write();
  res.send(db.data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
