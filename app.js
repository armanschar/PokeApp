import "./utils/LoadEnvConfig.js";
import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { projectRoot } from "./utils/Paths.js";
import homeRoutes from "./routes/home-router.js";
import typesRoutes from "./routes/types-router.js";
import pokesRoutes from "./routes/pokes-router.js";
import regionsRoutes from "./routes/regions-router.js";
import context from "./context/AppContext.js";
import { GetSection } from "./utils/helpers/hbs/Section.js";
import { GetRegionNames } from "./utils/helpers/hbs/GetRegionName.js";
import { GetTypeName } from "./utils/helpers/hbs/GetTypeName.js";
import { Equals } from "./utils/helpers/hbs/Equal.js";
import multer from "multer";
import {v4 as uuidv4} from "uuid";

const app = express();

app.engine(
  "hbs",
  engine({
    layoutsDir: "views/layouts",
    defaultLayout: "main",
    extname: ".hbs",
    helpers: {
      getRegionName: GetRegionNames,
      eq: Equals,
      section: GetSection,
      getTypeName: GetTypeName,
    },
  })
);

app.set("view engine", "hbs");
app.set("views", "views");

const storageForPokeImg = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(projectRoot, "public", "images", "pokes"));
  },
  filename: (req, file, cb) => {
    const fileName = `${uuidv4()}-${file.originalname}`;
    cb(null, fileName);
  },
});

app.use(multer({ storage: storageForPokeImg }).single("pokeImg"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(projectRoot, "public")));

app.use("/", homeRoutes);
app.use("/types", typesRoutes);
app.use("/pokes", pokesRoutes);
app.use("/regions", regionsRoutes);



try {
  await context.Sequelize.sync();
  app.listen(process.env.PORT);
  console.log(`Server is running on port ${process.env.PORT}`);
} catch (error) {
  console.error("Error synchronizing database:", error);
}
