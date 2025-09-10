import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "./db.js";
import uploadRouter from "./routes/upload.js";
import filesRouter from "./routes/files.js";
import extractRouter from "./routes/extract.js";
import invoicesRouter from "./routes/invoices.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/upload", uploadRouter);
app.use("/files", filesRouter);
app.use("/extract", extractRouter);
app.use("/invoices", invoicesRouter);

const PORT = process.env.PORT || 4000;
(async () => {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI required");
  await connectDB(process.env.MONGODB_URI);
  app.listen(PORT, () => console.log("API running on", PORT));
})();
