export function GetTypeName(typesList, typeId) {
  if (!typesList || !typeId) return "Sin tipo";
  const type = typesList.find((t) => Number(t.id) === Number(typeId));
  return type ? type.name : "Sin tipo";
}
