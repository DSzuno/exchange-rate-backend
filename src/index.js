import dotenv from "dotenv";
import { runServer } from "./server.js";

dotenv.config();

const port = parseInt(process.env.PORT || 7500);

runServer(port).catch(console.error);
