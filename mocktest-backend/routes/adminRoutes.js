const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const router = express.Router();

// Get admin list from .env
const adminIds = process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(",") : [];

// API to send admin list to frontend
router.get("/admins", (req, res) => {
  res.json({ adminIds });
});

module.exports = router;
