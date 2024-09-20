import express from "express";
import expressWs from "express-ws";
import dotenv from "@dotenvx/dotenvx";
import { createClient } from "@supabase/supabase-js";
import { calculateScore } from "./utils.mjs";

dotenv.config();
const app = express();
expressWs(app);
const port = process.env.PORT || 8080;

const supabaseUrl = "https://wlgpjikgdvkmemldjqjk.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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

app.ws("/api/click", (ws, req) => {
  ws.on("connection", (stream) => {
    console.log("someone connected!");
    console.log({ stream });
  });

  ws.on("message", (stream) => {
    console.log("message received");
  });
});

app.get("/api/scores", async (req, res) => {
  const { data: clicks, error } = await supabase.from("click").select();
  const totalPointsByTeam = {};
  for (const click of clicks) {
    if (!totalPointsByTeam[click.team]) {
      totalPointsByTeam[click.team] = click.points;
    }
    totalPointsByTeam[click.team] += click.points;
  }
  res.json(totalPointsByTeam);
});

app.get("/api/clicks", async (req, res) => {
  const { data: clicks, error } = await supabase
    .from("click")
    .select()
    .order("clicked", { ascending: false })
    .limit(10);
  res.json(clicks);
});

app.post("/api/clicks", async (req, res) => {
  const { team } = req.body;
  // get most recent click
  const { data: clicks } = await supabase
    .from("click")
    .select()
    .order("clicked", { ascending: false })
    .limit(1);
  const mostRecentClick = clicks[0];
  now = new Date();
  const timeSinceLastClick = now - new Date(mostRecentClick.created_at);
  const timeSinceLastClickInSeconds = timeSinceLastClick / 1000;
  const points = calculateScore(timeSinceLastClickInSeconds);
  const { data: newClick } = await supabase
    .from("click")
    .insert([{ team, points }]);
  res.json(newClick);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
