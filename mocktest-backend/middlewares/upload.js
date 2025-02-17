const multer = require("multer");

const storage = multer.diskStorage({
  destination: "/tmp/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max file size
});

module.exports = upload;
