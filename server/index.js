import "dotenv/config";
import express from "express";
import * as api from "./router.js";
import { initialize } from "./app.js";

// await initialize();

const app = express();

app.use(express.static("public"));

// app.use(express.json());
// app.use("/api", api.router);

app.listen(3000, async () => {
  console.log(`Server listening on port 3000`);
});
