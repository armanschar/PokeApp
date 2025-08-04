import connection from "../utils/DbConnection.js";
import PokesModel from "../models/PokeModel.js";
import RegionsModel from "../models/RegionModel.js";
import TypesModel from "../models/TypeModel.js";

// initialize the database connection

try {
  await connection.authenticate();
  console.log("Database connection established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

//relations
TypesModel.hasMany(PokesModel, {
  foreignKey: "typeId",
});
PokesModel.belongsTo(TypesModel, {
  foreignKey: "typeId",
});
RegionsModel.hasMany(PokesModel, {
  foreignKey: "regionId",
});
PokesModel.belongsTo(RegionsModel, {
  foreignKey: "regionId",
});

export default {
  Sequelize: connection,
  PokesModel,
  RegionsModel,
  TypesModel,
};
