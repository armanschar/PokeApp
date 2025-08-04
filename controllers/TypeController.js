import context from "../context/AppContext.js";

export async function GetIndex(req, res, next) {
  try {
    const result = await context.TypesModel.findAll();
    const types = result.map((result) => result.dataValues);
    res.render("types", {
      typesList: types,
      hasTypes: types.length > 0,
      "page-title": "Mantenimiento de Tipos",
    });
  } catch (error) {
    console.error("Error fetching types:", error);
  }
}

export function GetCreate(req, res, next) {
  res.render("types/save", {
    editMode: false,
    "page-title": "Crear Nuevo Tipo",
  });
}

export async function PostCreate(req, res, next) {
  const name = req.body.Name;

  if (!name || name.trim() === "") {
    return res.render("types/save", {
      editMode: false,
      error: "El nombre del tipo es requerido",
      "page-title": "Crear Nuevo Tipo",
    });
  }

  try {
    context.TypesModel.create({
      name: name,
    });

    return res.redirect("/types");
  } catch (error) {
    console.error("Error creating type:", err);
  }
}

export async function GetEdit(req, res, next) {
  const id = req.params.typesId;

  try {
    const result = await context.TypesModel.findOne({
      where: { id: id },
    });
    if (!result) {
      return res.redirect("/types");
    }
    const type = result.dataValues;
    res.render("types/save", {
      editMode: true,
      type: type,
      "page-title": `Editar Tipo: ${type.name}`,
    });
  } catch (error) {
    console.error("Error fetching type for edit:", error);
  }
}

export async function PostEdit(req, res, next) {
  const name = req.body.Name;
  const id = req.body.TypeId;

  try {
    const result = await context.TypesModel.findOne({
      where: { id: id },
    });
    if (!result) {
      return res.redirect("/types");
    }
    await context.TypesModel.update({ name: name }, { where: { id: id } });
    return res.redirect("/types");
  }catch (error) {
    console.error("Error updating type:", error);
  }
}

export async function GetDelete(req, res, next) {
  const id = req.params.typesId;

  try {
    const result = await context.TypesModel.findOne({
      where: { id: id },
    });
    if (!result) {
      return res.redirect("/types");
    }
    const type = result.dataValues;
    res.render("types/delete", {
      type: type,
      "page-title": `Eliminar Tipo: ${type.name}`,
    });
  } catch (error) {
    console.error("Error fetching type for delete:", error);
  }
}

export async function PostDelete(req, res, next) {
  const id = req.body.TypeId;

  try{
    await context.TypesModel.destroy({ where: { id: id } });
    return res.redirect("/types");
  }catch (error) {
    console.error("Error deleting type:", error);
  }
}
