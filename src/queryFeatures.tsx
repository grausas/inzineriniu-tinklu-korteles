// export async function queryFeatures(layer: __esri.FeatureLayer) {
//   let allFeatures: __esri.Graphic[] = [];
//   let exceededTransferLimit = true;
//   const params = {
//     where: "1=1",
//     returnGeometry: false,
//     outFields: ["*"],
//     start: 0,
//     num: 2000,
//   };

//   while (exceededTransferLimit) {
//     const results = await layer.queryFeatures(params);
//     allFeatures = allFeatures.concat(results.features);
//     exceededTransferLimit = results.exceededTransferLimit;

//     if (exceededTransferLimit) {
//       params.start += params.num;
//     }
//   }

//   return allFeatures;
// }

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
  console.log(results);

  return results.features;
}
