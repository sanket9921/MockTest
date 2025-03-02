const express = require("express");
const cors = require("cors");
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
// require("dotenv").config();

const app = express();
const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true); // Allow all origins
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow credentials (cookies, authorization headers)
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.use("/api/test-groups", testGroupRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/options", optionRoutes);
app.use("/api/answer", correctAnswerRoutes);
app.use("/api", testAttemptRoutes);
app.use("/api/passage", passageRoutes);

// Sync Database
sequelize
  .sync({ alter: true }) // Auto-update tables if they change
  .then(() => console.log("Database synced successfully!"))
  .catch((err) => console.error("Error syncing database:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// sequelize.sync().then(() => {
//   app.listen(process.env.PORT || 5000, () => {
//     console.log("Server is running...");
//   });
// });
