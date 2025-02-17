const { sequelize } = require("../models");

exports.executeTransaction = async (callback) => {
  const transaction = await sequelize.transaction();
  try {
    const result = await callback(transaction);
    await transaction.commit();
    return result;
  } catch (error) {
    await transaction.rollback();
    console.error("Transaction Error:", error);
    throw error;
  }
};
