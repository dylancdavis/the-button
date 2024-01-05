// const express = require("express");
import express from "express";
const app = express();
const port = 8000;

import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";

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

app.get("/last-clicked", (req, res) => {
  const db = new LowSync(new JSONFileSync("db.json"), {});
  db.read();
  res.send(db.data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
