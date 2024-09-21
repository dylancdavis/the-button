import express from "express";
import expressWs from "express-ws";
import dotenv from "@dotenvx/dotenvx";
import { createClient } from "@supabase/supabase-js";
import { calculatePointsForButtonAge } from "./utils.mjs";

dotenv.config();
const app = express();
const wsInstance = expressWs(app);
const port = process.env.PORT || 8080;

const supabaseUrl = "https://wlgpjikgdvkmemldjqjk.supabase.co";
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.static("build"));
app.use(express.json());

async function getButtonAgeInSeconds() {
  const { data: clicks } = await supabase
    .from("click")
    .select()
    .order("clicked", { ascending: false })
    .limit(1);
  console.log("clicks: ", clicks);
  const lastReset = new Date(clicks[0].clicked);
  console.log({ lastReset });
  const myVal = new Date() - lastReset;
  return (new Date() - lastReset) / 1000;
}

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.ws("/api/click", async (ws, req) => {
  console.log(
    "Client connected. Number of clients:  ",
    wsInstance.getWss().clients.size
  );
  const { data, error } = await supabase.from("click").select();
  ws.send(JSON.stringify(data));

  ws.on("message", async (team) => {
    const buttonAge = await getButtonAgeInSeconds();
    const points = calculatePointsForButtonAge(buttonAge);
    await supabase.from("click").insert({ team, points });
    const allClients = wsInstance.getWss().clients;
    for (const client of allClients) {
      const { data, error } = await supabase.from("click").select();
      client.send(JSON.stringify(data));
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
