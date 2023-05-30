import ArcGISMap from "@arcgis/core/Map";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import MapView from "@arcgis/core/views/MapView";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import TileLayer from "@arcgis/core/layers/TileLayer";
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle.js";
import Basemap from "@arcgis/core/Basemap.js";
import MapImageLayer from "@arcgis/core/layers/MapImageLayer.js";
import Search from "@arcgis/core/widgets/Search.js";
import Zoom from "@arcgis/core/widgets/Zoom.js";
import Legend from "@arcgis/core/widgets/Legend.js";
import Home from "@arcgis/core/widgets/Home.js";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol.js";
import Expand from "@arcgis/core/widgets/Expand.js";
import BasemapGallery from "@arcgis/core/widgets/BasemapGallery.js";
import BasemapLayerList from "@arcgis/core/widgets/BasemapLayerList.js";

interface MapApp {
  view?: MapView;
}

const app: MapApp = {};

export function init(container: HTMLDivElement) {
  if (app.view) {
    app.view.destroy();
  }

  const layer = new FeatureLayer({
    url: "https://opencity.vplanas.lt/arcgis/rest/services/P_GIS_Inz_korteles/P_GIS_Inz_korteles/MapServer/0",
    outFields: ["*"],
    id: "staciakampes",
  });

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

  const baseMap = new Basemap({
    baseLayers: [
      new VectorTileLayer({
        portalItem: {
          id: "34adce6f797846bf8e971f402a251403",
        },
      }),
    ],
    title: "basemap",
    id: "basemap",
  });

  const map = new ArcGISMap({
    basemap: baseMap,
    layers: [layer],
  });

  const view = new MapView({
    map,
    container,
    center: [25.27043, 54.689],
    zoom: 12,
    ui: {
      components: ["attribution"],
    },
    constraints: {
      minScale: 500000,
      snapToZoom: false,
    },
  });
  const marker = new SimpleMarkerSymbol({ color: [203, 52, 52, 0.93] });

  const sources = [
    {
      url: "https://gis.vplanas.lt/arcgis/rest/services/Lokatoriai/PAIESKA_COMPOSITE/GeocodeServer",
      singleLineFieldName: "SingleLine",
      name: "Vplanas paieska",
      placeholder: "Ieškoti adreso arba vietovės",
      maxResults: 3,
      maxSuggestions: 6,
      minSuggestCharacters: 0,
      resultSymbol: marker,
    },
  ];

  const searchWidget = new Search({
    view: view,
    includeDefaultSources: false,
    sources: sources,
    popupEnabled: false,
    id: "search",
  });

  const searchExpand = new Expand({
    view,
    content: searchWidget,
  });

  view.ui.add(searchExpand, {
    position: "top-right",
    index: 2,
  });

  const zoom = new Zoom({
    view: view,
  });

  view.ui.add(zoom, {
    position: "top-right",
  });
  const home = new Home({
    view: view,
  });

  view.ui.add(home, {
    position: "top-right",
  });

  const legend = new Legend({
    view: view,
  });

  const legendExpand = new Expand({
    view,
    content: legend,
    expanded: true,
  });

  view.ui.add(legendExpand, "top-left");

  // const basemapGallery = new BasemapGallery({
  //   view: view,
  //   source: [
  //     baseMap,
  //     orto2022,
  //     darkBasemap,
  //     orto2022,
  //     darkBasemap,
  //     orto2022,
  //     darkBasemap,
  //   ],
  // });

  // // // Add widget to the top right corner of the view
  // view.ui.add(basemapGallery, {
  //   position: "bottom-right",
  // });

  // const basemapLayerList = new BasemapLayerList({
  //   view: view,
  //   basemapTitle: "DarkVEctor",
  //   headingLevel: 1,
  //   visibleElements: {
  //     statusIndicators: false,
  //     referenceLayers: false,
  //     errors: true,
  //   },
  // });

  // view.ui.add(basemapLayerList, {
  //   position: "bottom-right",
  // });

  const basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: darkBasemap,
  });
  view.ui.add(basemapToggle, "bottom-left");

  layer.when(() => {
    view.extent = layer.fullExtent;
  });

  return view;
}
