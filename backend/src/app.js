const express = require("express");
const app = express();
const port = 8000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/last-clicked", (req, res) => {
  return Date("2024-01-01");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
