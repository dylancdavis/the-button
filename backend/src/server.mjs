import path from "path";
import express from "express";
import expressWs from "express-ws";
import dotenv from "@dotenvx/dotenvx";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
const app = express();
const wsInstance = expressWs(app);
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

app.ws("/api/click", async (ws, req) => {
  console.log(
    "Client connected. Number of clients:  ",
    wsInstance.getWss().clients.size
  );

  const { data } = await supabase
    .from("click")
    .select()
    .order("clicked", { ascending: false });
  ws.send(JSON.stringify(data));

  ws.on("message", async (team) => {
    await supabase.from("click").insert({ team });
    const allClients = wsInstance.getWss().clients;
    for (const client of allClients) {
      const { data } = await supabase
        .from("click")
        .select()
        .order("clicked", { ascending: false });
      client.send(JSON.stringify(data));
    }
  });
});

// Send frontend on all other routes
app.get("*", (req, res) => {
  res.sendFile(path.resolve("build", "index.html"));
});

app.listen(port, () => {
  console.log(`Button application listening on port ${port}`);
});
