import express from "express";
const app = express();
const port = process.env.PORT || 8080;

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

app.get("/api/ping", (req, res) => {
  res.send("pong");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
