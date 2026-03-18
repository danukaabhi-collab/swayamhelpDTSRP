import { fetchRealtimeSchemes } from "./src/services/schemeSyncService.js";
import dotenv from "dotenv";
dotenv.config();

async function run() {
  console.log("Fetching schemes for 'Education'...");
  const res = await fetchRealtimeSchemes("Education");
  console.log("Response:", res);
}
run();
