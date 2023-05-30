export async function queryFeaturesCount(layer: __esri.FeatureLayer) {
  const count = layer.queryFeatureCount();

  return count;
}
