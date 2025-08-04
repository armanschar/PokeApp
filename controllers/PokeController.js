import context from "../context/AppContext.js";
import { sendEmail } from "../services/EmailServices.js";
import path from "path";
import fs from "fs";
import { projectRoot } from "../utils/Paths.js";

export async function GetIndex(req, res, next) {
  try {
    const pokesResult = await context.PokesModel.findAll({
      include: [{ model: context.TypesModel }, { model: context.RegionsModel }],
    });
    const typesResult = await context.TypesModel.findAll();
    const regionsResult = await context.RegionsModel.findAll();

    const pokes = pokesResult.map((result) => result.dataValues);
    const types = typesResult.map((t) => t.dataValues);
    const regions = regionsResult.map((r) => r.dataValues);

    res.render("pokes", {
      pokesList: pokes,
      hasPokes: pokes.length > 0,
      typesList: types,
      regionsList: regions,
      "page-title": "Mantenimiento de Pokes",
    });
  } catch (error) {
    console.error("Error fetching pokes:", error);
  }
}

export async function GetCreate(req, res, next) {
  try {
    const regionsResult = await context.RegionsModel.findAll();
    const typesResult = await context.TypesModel.findAll();
    const regions = regionsResult.map((r) => r.dataValues);
    const types = typesResult.map((t) => t.dataValues);

    res.render("pokes/save", {
      editMode: false,
      regionsList: regions,
      hasRegions: regions.length > 0,
      typesList: types,
      hasTypes: types.length > 0,
      "page-title": "Crear Nuevo Pokemon",
    });
  } catch (error) {
    console.error(
      "Error fetching regions or types for pokemon creation:",
      error
    );
  }
}

export async function PostCreate(req, res, next) {
  const name = req.body.Name;
  const typeid = req.body.TypeId;
  const regionId = req.body.regionId;

  const pokeimg = req.file;
  const pokeImgPath = "\\" + path.relative("public", pokeimg.path);

  const errors = [];
  if (!name || name.trim() === "") {
    errors.push("El nombre del pokemon es requerido");
  }
  if (!pokeimg) {
    errors.push("La imagen del pokemon es requerida");
  }
  if (!typeid || typeid.trim() === "") {
    errors.push("El tipo del pokemon es requerido");
  }
  if (!regionId || regionId.trim() === "") {
    errors.push("La región del pokemon es requerida");
  }

  if (errors.length > 0) {
    try {
      const regionsResult = await context.RegionsModel.findAll();
      const typesResult = await context.TypesModel.findAll();
      const regions = regionsResult.map((r) => r.dataValues);
      const types = typesResult.map((t) => t.dataValues);

      return res.render("pokes/save", {
        editMode: false,
        regionsList: regions,
        hasRegions: regions.length > 0,
        typesList: types,
        hasTypes: types.length > 0,
        errors: errors,
        formData: req.body,
        "page-title": "Crear Nuevo Pokemon",
      });
    } catch (error) {
      console.error(
        "Error fetching regions or types for pokemon creation:",
        error
      );
      res.redirect("/pokes");
    }
    return;
  }

  try {
    const pokeImgPath = pokeimg? "\\" + path.relative("public", pokeimg.path): null;
    await context.PokesModel.create({
      name: name,
      pokeimg: pokeImgPath,
      typeId: typeid,
      regionId: regionId,
    });
    // Send email notification after creating a new pokemon
    await sendEmail({
      to: "ascharbay@hotmail.com",
      subject: "Nuevo Pokemon Creado",
      html: `<p>Se ha creado un nuevo pokemon: <strong>${name}</strong></p>`,
    });
    return res.redirect("/pokes");
  } catch (error) {
    console.error("Error creating pokemon:", err);
  }
}

export async function GetEdit(req, res, next) {
  const id = req.params.pokesId;

  try {
    const result = await context.PokesModel.findOne({
      where: { id: id },
    });
    if (!result) {
      return res.redirect("/pokes");
    }
    const poke = result.dataValues;
    const regionsResult = await context.RegionsModel.findAll();
    const typesResult = await context.TypesModel.findAll();
    const regions = regionsResult.map((r) => r.dataValues);
    const types = typesResult.map((t) => t.dataValues);
    res.render("pokes/save", {
      editMode: true,
      poke: poke,
      regionsList: regions,
      hasRegions: regions.length > 0,
      typesList: types,
      hasTypes: types.length > 0,
      "page-title": `Editar Pokemon: ${poke.name}`,
    });
  } catch (error) {
    console.error("Error fetching pokemon for edit:", error);
  }
}

export async function PostEdit(req, res, next) {
  const id = req.body.PokesId;
  const name = req.body.Name;
  const typeid = req.body.TypeId;
  const regionId = req.body.regionId;
  let pokeImgPath = null;
  const pokeimg = req.file;

  const errors = [];
  if (!name || name.trim() === "") {
    errors.push("El nombre del pokemon es requerido");
  }
  if (!typeid || typeid.trim() === "") {
    errors.push("El tipo del pokemon es requerido");
  }
  if (!regionId || regionId.trim() === "") {
    errors.push("La región del pokemon es requerida");
  }

  if (errors.length > 0) {
    try {
      const regionsResult = await context.RegionsModel.findAll();
      const typesResult = await context.TypesModel.findAll();
      const pokeResult = await context.PokesModel.findByPk(id);
      const regions = regionsResult.map((r) => r.dataValues);
      const types = typesResult.map((t) => t.dataValues);
      const poke = pokeResult.dataValues;
      return res.render("pokes/save", {
        editMode: true,
        poke: poke,
        regionsList: regions,
        hasRegions: regions.length > 0,
        typesList: types,
        hasTypes: types.length > 0,
        errors: errors,
        formData: req.body,
        "page-title": `Editar Pokemon: ${poke.name}`,
      });
    } catch (error) {
      console.error("Error fetching regions or types for pokemon edit:", error);
    }
    res.redirect("/pokes");
    return;
  }

  try {
    const result = await context.PokesModel.findOne({ where: { id: id } });

    if (!result) {
      return res.redirect("/pokes");
    }

    let pokeImgPath;
    if (pokeimg) {
      pokeImgPath = "\\" + path.relative("public", pokeimg.path);
    } else {
      pokeImgPath = result.pokeimg;
    }
    await context.PokesModel.update(
      { name: name, pokeimg: pokeImgPath, typeId: typeid, regionId: regionId },
      { where: { id: id } }
    );
    res.redirect("/pokes");
  } catch (error) {
    console.error("Error updating pokemon:", error);
  }
}

export async function GetDelete(req, res, next) {
  const id = req.params.pokesId;

  try {
    const result = await context.PokesModel.findOne({ where: { id: id } });
    if (!result) {
      return res.redirect("/pokes");
    }

    const regionsResult = await context.RegionsModel.findAll();
    const typesResult = await context.TypesModel.findAll();
    const regions = regionsResult.map((r) => r.dataValues);
    const types = typesResult.map((t) => t.dataValues);

    const poke = result.dataValues;
    res.render("pokes/delete", {
      poke: poke,
      regionsList: regions,
      hasRegions: regions.length > 0,
      typesList: types,
      hasTypes: types.length > 0,
      "page-title": `Eliminar Pokemon: ${poke.name}`,
    });
  } catch (error) {
    console.error("Error fetching pokemon for delete:", error);
  }
}

export async function PostDelete(req, res, next) {
  const id = req.body.PokesId;

  try {
    const result = await context.PokesModel.findOne({ where: { id: id } });
    if (!result) {
      return res.redirect("/pokes");
    }
    if (result.pokeimg) {
      const pokeImgPath = path.join(projectRoot, "public", result.pokeimg);
      if (fs.existsSync(pokeImgPath)) {
        fs.unlinkSync(pokeImgPath);
      }
    }
    await context.PokesModel.destroy({ where: { id: id } });
    return res.redirect("/pokes");
  } catch (error) {
    console.error("Error deleting pokemon:", error);
  }
}
