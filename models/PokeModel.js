import connection from "../utils/DbConnection.js";
import { DataTypes } from "sequelize";

const Pokes = connection.define("Pokes", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  pokeimg: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  typeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Types",
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  },
  regionId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "Regions",
      key: "id",
    },
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  }},{
  tableName: "Pokes",
  }
);

export default Pokes;
