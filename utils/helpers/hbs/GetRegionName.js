export function GetRegionNames(regionsList, regionId) {
  if (!regionsList || !regionId) return "Sin región";
  const region = regionsList.find((r) => Number(r.id) === Number(regionId));
  return region ? region.name : "Sin región";
}
