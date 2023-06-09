import ArcGISMap from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import VectorTileLayer from "@arcgis/core/layers/VectorTileLayer";
import BasemapToggle from "@arcgis/core/widgets/BasemapToggle.js";
import Basemap from "@arcgis/core/Basemap.js";
import Search from "@arcgis/core/widgets/Search.js";
import Zoom from "@arcgis/core/widgets/Zoom.js";
import Legend from "@arcgis/core/widgets/Legend.js";
import Home from "@arcgis/core/widgets/Home.js";
import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol.js";
import Expand from "@arcgis/core/widgets/Expand.js";
import LayerList from "@arcgis/core/widgets/LayerList.js";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

// import SimpleMarkerSymbol from "@arcgis/core/symbols/SimpleMarkerSymbol.js";
import { layersArr } from "./layers";

interface MapApp {
  view?: MapView;
}

const app: MapApp = {};

export function init(container: HTMLDivElement) {
  if (app.view) {
    app.view.destroy();
  }

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
    layers: layersArr,
  });

  const view = new MapView({
    map,
    container,
    center: [25.27043, 54.689],
    zoom: 11,
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
    expandTooltip: "Paieška",
  });

  view.ui.add(searchExpand, {
    position: "top-left",
    index: 2,
  });

  const legend = new Legend({
    view: view,
  });

  const legendExpand = new Expand({
    view,
    content: legend,
    expanded: true,
    expandTooltip: "Legenda",
  });

  view.ui.add(legendExpand, "top-right");
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

  const basemapToggle = new BasemapToggle({
    view: view,
    nextBasemap: orto2022,
  });
  view.ui.add(basemapToggle, "bottom-right");

  const layerList = new LayerList({
    view: view,
  });

  const layerListExpand = new Expand({
    view,
    content: layerList,
    expanded: false,
    expandTooltip: "Papildomi sluoksniai",
  });
  // Adds widget below other elements in the top left corner of the view
  view.ui.add(layerListExpand, {
    position: "top-left",
  });

  reactiveUtils
    .whenOnce(() => view.ready)
    .then(() => {
      const layers = view.map.layers;
      layers.map((layer: any) => {
        const rendererValue = layer.renderer.uniqueValueInfos;
        if (rendererValue) {
          const filteredValues = rendererValue.filter((value: any) => {
            return !value.label.includes("kryptis");
          });
          layer.renderer.uniqueValueInfos = filteredValues;
        }
      });
    });

  return view;
}
