import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Basemap from "@arcgis/core/Basemap.js";

export const featureLayerSt = () => {
  const layer = new FeatureLayer({
    url: "https://opencity.vplanas.lt/arcgis/rest/services/P_GIS_Inz_korteles/P_GIS_Inz_korteles/MapServer/0",
    outFields: ["*"],
    id: "staciakampes",
  });
  return layer;
};

export const featureLayerTr = () => {
  const layer = new FeatureLayer({
    url: "https://opencity.vplanas.lt/arcgis/rest/services/P_GIS_Inz_korteles/P_GIS_Inz_korteles/MapServer/1",
    outFields: ["*"],
    id: "trapecines",
  });
  return layer;
};

export const layers = [featureLayerSt, featureLayerTr];

const darkBasemap = new Basemap({
  portalItem: {
    id: "ab77c15cf1094e7aa0774c8084baea86",
  },
});
const lightBasemap = new Basemap({
  portalItem: {
    id: "34adce6f797846bf8e971f402a251403",
  },
});

const orto2022 = new Basemap({
  portalItem: {
    id: "f089d2cf232643819a0faacc679f2c4b",
  },
});

export const baseMaps = [darkBasemap, lightBasemap, orto2022];
