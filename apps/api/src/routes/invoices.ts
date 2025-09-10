import express from "express";
import { Invoice } from "../models/Invoice.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const q = req.query.q as string | undefined;
  const filter = q ? { $or: [{ "vendor.name": { $regex: q, $options: "i" } }, { "invoice.number": { $regex: q, $options: "i" } }] } : {};
  const list = await Invoice.find(filter).sort({ createdAt: -1 }).limit(200).lean();
  res.json(list);
});

router.get("/:id", async (req, res) => {
  const doc = await Invoice.findById(req.params.id);
  if (!doc) return res.status(404).json({ error: "Not found" });
  res.json(doc);
});

router.post("/", async (req, res) => {
  const payload = req.body;
  const created = await Invoice.create({ ...payload, createdAt: new Date() });
  res.json(created);
});

router.put("/:id", async (req, res) => {
  const updated = await Invoice.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await Invoice.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
