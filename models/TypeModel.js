import connection from "../utils/DbConnection.js";
import { DataTypes } from "sequelize";

const Types = connection.define("Types", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
  },{
  tableName: "Types",
  }
);

export default Types;