import context from "../context/AppContext.js";
import { Op } from "sequelize";

export function GetHome(req, res, next) {
  const searchTerm = req.query.search || "";
  const typeFilter = req.query.type || "";
  const regionFilter = req.query.region || "";

  Promise.all([context.TypesModel.findAll(), context.RegionsModel.findAll(), context.PokesModel.findAll()])
    .then(([types, regions]) => {
      const where = {};
      if (searchTerm) {
        where.name = { [Op.like]: `%${searchTerm}%` };
      }
      if (typeFilter) {
        where.typeId = typeFilter;
      }
      if (regionFilter) {
        where.regionId = regionFilter;
      }
      context.PokesModel.findAll({
        where,
        include: [
          { model: context.TypesModel },
          { model: context.RegionsModel },
        ],
      })
        .then((pokes) => {
          res.render("home/home", {
            pokesList: pokes.map((p) => p.dataValues),
            typesList: types.map((t) => t.dataValues),
            regionsList: regions.map((r) => r.dataValues),
            hasPokes: pokes.length > 0,
            hasTypes: types.length > 0,
            hasRegions: regions.length > 0,
            searchTerm,
            selectedType: typeFilter,
            selectedRegion: regionFilter,
            "page-title": "PokeApp - Home",
          });
        })
        .catch((error) => {
          console.error("Error fetching pokemons for home:", error);
          res.render("home/home", {
            pokesList: [],
            typesList: [],
            regionsList: [],
            hasPokes: false,
            hasTypes: false,
            hasRegions: false,
            searchTerm,
            selectedType: typeFilter,
            selectedRegion: regionFilter,
            "page-title": "PokeApp - Home",
          });
        });
    })
    .catch((error) => {
      console.error("Error fetching types or regions for home:", error);
      res.render("home/home", {
        pokesList: [],
        typesList: [],
        regionsList: [],
        hasPokes: false,
        hasTypes: false,
        hasRegions: false,
        searchTerm,
        selectedType: typeFilter,
        selectedRegion: regionFilter,
        "page-title": "PokeApp - Home",
      });
    });
}
