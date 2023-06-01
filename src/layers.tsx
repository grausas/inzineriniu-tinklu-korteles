import FeatureLayer from "@arcgis/core/layers/FeatureLayer";

export const featureLayerSt = () => {
  const layer = new FeatureLayer({
    url: "https://opencity.vplanas.lt/arcgis/rest/services/P_GIS_Inz_korteles/P_GIS_Inz_korteles/MapServer/0",
    outFields: ["*"],
    id: "staciakampes",
    title: "Stačiakampės planšetės",
    listMode: "hide",
    visible: true,
  });
  return layer;
};

export const featureLayerTr = () => {
  const layer = new FeatureLayer({
    url: "https://opencity.vplanas.lt/arcgis/rest/services/P_GIS_Inz_korteles/P_GIS_Inz_korteles/MapServer/1",
    outFields: ["*"],
    id: "trapecines",
    title: "Trapecinės planšetės",
    listMode: "hide",
    visible: false,
  });
  return layer;
};

export const featuresTable = () => {
  const layer = new FeatureLayer({
    url: "https://opencity.vplanas.lt/arcgis/rest/services/P_GIS_Inz_korteles/P_GIS_Inz_korteles/MapServer/2",
    outFields: ["*"],
    id: "trapecines",
  });
  return layer;
};

export const layers = [featureLayerSt, featureLayerTr];
const minScale = 10000;
const maxScale = 0;

export const featureLayer1 = () => {
  const layer = new FeatureLayer({
    url: "https://atviras.vplanas.lt/arcgis/rest/services/mapA4/Inzinerija/MapServer/3",
    outFields: ["*"],
    id: "Duj_t",
    title: "Dujotiekio šuliniai",
    visible: false,
    minScale: minScale,
    maxScale: maxScale,
  });
  return layer;
};
export const featureLayer2 = () => {
  const layer = new FeatureLayer({
    url: "https://atviras.vplanas.lt/arcgis/rest/services/mapA4/Inzinerija/MapServer/7",
    outFields: ["*"],
    id: "El_t",
    title: "Elektros šuliniai",
    visible: false,
    minScale: minScale,
    maxScale: maxScale,
  });
  return layer;
};
export const featureLayer3 = () => {
  const layer = new FeatureLayer({
    url: "https://atviras.vplanas.lt/arcgis/rest/services/mapA4/Inzinerija/MapServer/11",
    outFields: ["*"],
    id: "Rys_t",
    title: "Ryšio šuliniai",
    visible: false,
    minScale: minScale,
    maxScale: maxScale,
  });
  return layer;
};
export const featureLayer4 = () => {
  const layer = new FeatureLayer({
    url: "https://atviras.vplanas.lt/arcgis/rest/services/mapA4/Inzinerija/MapServer/15",
    outFields: ["*"],
    id: "Sil_t",
    title: "Šilumotiekio šuliniai",
    visible: false,
    minScale: minScale,
    maxScale: maxScale,
  });
  return layer;
};
export const featureLayer5 = () => {
  const layer = new FeatureLayer({
    url: "https://atviras.vplanas.lt/arcgis/rest/services/mapA4/Inzinerija/MapServer/19",
    outFields: ["*"],
    id: "Vand_t",
    title: "Vandentieko šuliniai",
    visible: false,
    minScale: minScale,
    maxScale: maxScale,
  });
  return layer;
};
export const featureLayer6 = () => {
  const layer = new FeatureLayer({
    url: "https://atviras.vplanas.lt/arcgis/rest/services/mapA4/Inzinerija/MapServer/23",
    outFields: ["*"],
    id: "Nuot_t",
    title: "Nuotekų šuliniai",
    visible: false,
    minScale: minScale,
    maxScale: maxScale,
  });
  return layer;
};
export const featureLayer7 = () => {
  const layer = new FeatureLayer({
    url: "https://atviras.vplanas.lt/arcgis/rest/services/mapA4/Inzinerija/MapServer/27",
    outFields: ["*"],
    id: "Liet_t",
    title: "Lietaus nuotekų šuliniai",
    visible: false,
    minScale: minScale,
    maxScale: maxScale,
  });
  return layer;
};
export const featureLayer8 = () => {
  const layer = new FeatureLayer({
    url: "https://atviras.vplanas.lt/arcgis/rest/services/mapA4/Inzinerija/MapServer/31",
    outFields: ["*"],
    id: "Naft_t",
    title: "Naftotiekio šuliniai",
    visible: false,
    minScale: minScale,
    maxScale: maxScale,
  });
  return layer;
};
export const featureLayer9 = () => {
  const layer = new FeatureLayer({
    url: "https://atviras.vplanas.lt/arcgis/rest/services/mapA4/Inzinerija/MapServer/35",
    outFields: ["*"],
    id: "Inz_t",
    title: "Kiti šuliniai",
    visible: false,
    minScale: minScale,
    maxScale: maxScale,
  });
  return layer;
};

export const layersArr = [
  featureLayer1(),
  featureLayer2(),
  featureLayer3(),
  featureLayer4(),
  featureLayer5(),
  featureLayer6(),
  featureLayer7(),
  featureLayer8(),
  featureLayer9(),
  featureLayerSt(),
  featureLayerTr(),
];
