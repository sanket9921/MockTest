const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const models = {
  TestGroup: require("./testGroup")(sequelize, DataTypes),
  Test: require("./test")(sequelize, DataTypes),
  Question: require("./question")(sequelize, DataTypes),
  Option: require("./option")(sequelize, DataTypes),
  CorrectAnswer: require("./correctAnswer")(sequelize, DataTypes),
};

Object.keys(models).forEach((model) => {
  if ("associate" in models[model]) {
    models[model].associate(models);
  }
});

module.exports = { sequelize, models };
