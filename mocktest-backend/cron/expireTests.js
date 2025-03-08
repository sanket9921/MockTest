const cron = require("node-cron");
const { models } = require("../models");
const { Op } = require("sequelize");

cron.schedule("* * * * *", async () => {
  try {
    const currentTime = new Date();
    await models.TestAttempt.update(
      { status: "expired" },
      {
        where: {
          status: "in_progress",
          end_time: { [Op.ne]: null, [Op.lt]: currentTime },
        },
      }
    );
    console.log("Expired tests updated.");
  } catch (error) {
    console.error("Error updating expired tests:", error);
  }
});
