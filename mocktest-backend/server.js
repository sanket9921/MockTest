const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middlewares/authMiddleware");

const bodyParser = require("body-parser");
// const sequelize = require("./config/db");
const { sequelize, models } = require("./models"); // Import Sequelize models

const testGroupRoutes = require("./routes/testGroupRoutes");
const testRoutes = require("./routes/testRoutes");
const questionRoutes = require("./routes/questionRoutes");
const optionRoutes = require("./routes/optionsRoutes");
const correctAnswerRoutes = require("./routes/correctAnswerRoutes");
const testAttemptRoutes = require("./routes/testAttemptRoutes");
const passageRoutes = require("./routes/passageRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authorizeMiddleware = require("./middlewares/authorizeMiddleware");
// require("dotenv").config();

const app = express();
// const corsOptions = {
//   origin: (origin, callback) => {
//     callback(null, true); // Allow all origins
//   },
//   methods: ["GET", "POST", "PUT", "DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true, // Allow credentials (cookies, authorization headers)
// };

const corsOptions = {
  origin: "http://127.0.0.1:5173", // ✅ Change this to your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // ✅ Required for cookies
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(authMiddleware);
app.use(authorizeMiddleware);

app.use("/api/test-groups", testGroupRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/options", optionRoutes);
app.use("/api/answer", correctAnswerRoutes);
app.use("/api", testAttemptRoutes);
app.use("/api/passage", passageRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api", adminRoutes);

// Sync Database
sequelize
  .sync({ alter: true }) // Auto-update tables if they change
  .then(() => console.log("Database synced successfully!"))
  .catch((err) => console.error("Error syncing database:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () =>
  console.log(`Server running on port ${PORT}`)
);

// sequelize.sync().then(() => {
//   app.listen(process.env.PORT || 5000, () => {
//     console.log("Server is running...");
//   });
// });
