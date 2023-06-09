import { useContext, useEffect, useRef } from "react";
import { Box } from "@mantine/core";
import { MapContext } from "../context/map-context";

export function ArcGISMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const { loadMap } = useContext(MapContext);

  useEffect(() => {
    if (mapRef.current && loadMap) {
      loadMap(mapRef.current);
    }
  }, [mapRef, loadMap]);

  return <Box w={"100%"} h={"100%"} ref={mapRef}></Box>;
}
