const express = require("express");
const { getAllItems, createItem, deleteItem } = require("./db");

function validateTitle(title) {
  return typeof title === "string" && title.trim().length >= 2;
}

function buildRouter() {
  const router = express.Router();

  router.get("/health", (req, res) => {
    res.json({ status: "ok", uptime: process.uptime() });
  });

  router.get("/api/items", async (req, res) => {
    const items = await getAllItems();
    res.json(items);
  });

  router.post("/api/items", async (req, res) => {
    const { title } = req.body || {};
    if (!validateTitle(title)) {
      return res.status(400).json({ error: "title must be at least 2 chars" });
    }
    const item = await createItem(title.trim());
    res.status(201).json(item);
  });

  router.delete("/api/items/:id", async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ error: "invalid id" });

    const result = await deleteItem(id);
    if (result.deleted === 0) return res.status(404).json({ error: "not found" });
    res.json({ ok: true });
  });

  return { router, validateTitle };
}

module.exports = { buildRouter };
