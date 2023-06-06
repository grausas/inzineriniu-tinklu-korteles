export async function queryFeatures(
  layer: __esri.FeatureLayer,
  page: number,
  whereParams: string
) {
  const params = {
    where: whereParams,
    returnGeometry: false,
    outFields: ["*"],
    start: page * 100,
    num: 100,
  };

  const results = await layer.queryFeatures(params);
  return results.features;
}
