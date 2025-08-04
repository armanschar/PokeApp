import context from "../context/AppContext.js";

export async function GetIndex(req, res, next) {
  try {
    const result = await context.RegionsModel.findAll();
    const regions = result.map((result) => result.dataValues);
    res.render("regions", {
      regionsList: regions,
      hasRegions: regions.length > 0,
      "page-title": "Mantenimiento de Regiones",
    });
  } catch (error) {
    console.error("Error fetching regions:", error);
  }
}

export function GetCreate(req, res, next) {
  res.render("regions/save", {
    editMode: false,
    "page-title": "Crear Nueva Región",
  });
}

export async function PostCreate(req, res, next) {
  const name = req.body.Name;

  if (!name || name.trim() === "") {
    return res.render("regions/save", {
      editMode: false,
      error: "El nombre de la Región es requerido",
      "page-title": "Crear Nueva Región",
    });
  }

  //create with await

  try {
    await context.RegionsModel.create({
      name: name,
    });

    return res.redirect("/regions");
  } catch (error) {
    console.error("Error creating region:", err);
  }
}

export async function GetEdit(req, res, next) {
  const id = req.params.regionId;

  try {
    const result = await context.RegionsModel.findOne({
      where: { id: id },
    });
    if (!result) {
      return res.redirect("/regions");
    }
    const region = result.dataValues;
    res.render("regions/save", {
      editMode: true,
      region: region,
      "page-title": `Editar región: ${region.name}`,
    });
  } catch (error) {
    console.error("Error fetching regions for edit:", error);
  }
}

export async function PostEdit(req, res, next) {
  const name = req.body.Name;
  const id = req.body.regionId;

  try {
    const result = await context.RegionsModel.findOne({
      where: { id: id },
    });
    if (!result) {
      return res.redirect("/regions");
    }
    await context.RegionsModel.update({ name: name }, { where: { id: id } });
    res.redirect("/regions");
  } catch {
    console.error("Error fetching region for edit:", error);
  }
}

export async function GetDelete(req, res, next) {
  const id = req.params.regionId;

  try {
    const result = await context.RegionsModel.findOne({ where: { id: id } });
    if (!result) {
      return res.redirect("/regions");
    }
    const region = result.dataValues;
    res.render("regions/delete", {
      region: region,
      "page-title": `Eliminar Región: ${region.name}`,
    });
  } catch {
    console.error("Error fetching region for delete:", error);
  }
}

export async function PostDelete(req, res, next) {
  const id = req.body.regionId;

  try{
    await context.RegionsModel.destroy({ where: { id: id } });
    return res.redirect("/regions");
  }catch (error) {
    console.error("Error deleting region:", err);
  }
}
