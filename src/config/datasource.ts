import { config } from "dotenv";
import path from "path";

config({ path: path.join(__dirname, "../../.env") });

export const csvFileName = process.env.CSV_FILE ?? "";