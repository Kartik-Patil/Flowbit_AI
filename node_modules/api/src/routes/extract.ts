import express from "express";
import { ObjectId } from "mongodb";
import { gfsBucket } from "../db.js";
import pdfParse from "pdf-parse";
import { callGemini } from "../ai/gemini.js";
import { callGroq } from "../ai/groq.js";
import { fallbackExtract } from "../ai/fallback.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { fileId, model } = req.body;
  if (!fileId || !model) return res.status(400).json({ error: "fileId & model required" });
  if (!gfsBucket) return res.status(500).json({ error: "Storage not ready" });

  // get buffer from GridFS
  try {
    const _id = new ObjectId(fileId);
    const downloadStream = gfsBucket.openDownloadStream(_id);

    const chunks: Buffer[] = [];
    downloadStream.on("data", (c) => chunks.push(Buffer.from(c)));
    downloadStream.on("end", async () => {
      const buffer = Buffer.concat(chunks);
      const data = await pdfParse(buffer);
      const text = data.text || "";

      // choose provider
      let extracted;
      try {
        if (model === "gemini") {
          extracted = await callGemini(text);
        } else if (model === "groq") {
          extracted = await callGroq(text);
        } else {
          extracted = await fallbackExtract(text);
        }
        return res.json({ extracted });
      } catch (err) {
        console.error("AI error:", err);
        // fallback to local extractor
        const fallback = await fallbackExtract(text);
        return res.json({ extracted: fallback, warning: "AI failed, used fallback" });
      }
    });

    downloadStream.on("error", (err) => {
      console.error(err);
      res.status(400).json({ error: "Cannot read file" });
    });
  } catch (e) {
    res.status(400).json({ error: "Invalid fileId" });
  }
});

export default router;
