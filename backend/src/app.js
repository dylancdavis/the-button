const express = require("express");
const app = express();
const port = 8000;

import { LowSync } from "lowdb";
import { JSONFileSync } from "lowdb/node";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get.get("/last-clicked-db", (req, res) => {
  const db = new LowSync(new JSONFileSync("db.json"));
  db.read();
  res.send(db.data);
});

app.get("/last-clicked", (req, res) => {
  res.send(Date("2024-01-01"));
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
