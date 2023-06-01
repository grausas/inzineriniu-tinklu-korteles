export async function queryFeaturesCount(
  layer: __esri.FeatureLayer,
  where: string
) {
  const params = {
    where: where,
  };
  const count = layer.queryFeatureCount(params);

  return count;
}
