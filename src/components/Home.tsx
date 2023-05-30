import { ActionIcon } from "@mantine/core";
import HomeVM from "@arcgis/core/widgets/Home/HomeViewModel";
import { useContext, useEffect, useState } from "react";
import { MapContext } from "../context/map-context";
import HomeIcon from "../assets/home.svg";

export function Home() {
  const [vm, setVM] = useState<InstanceType<typeof HomeVM>>();

  const { view } = useContext(MapContext);

  useEffect(() => {
    if (view) {
      setVM(new HomeVM({ view }));
    }
  }, [view]);

  return (
    <>
      <ActionIcon radius="xs" onClick={() => vm?.go()}>
        <img src={HomeIcon} alt="home" />
      </ActionIcon>
      <ActionIcon radius="m" onClick={() => console.log("layers")}>
        <img src={HomeIcon} alt="home" />
      </ActionIcon>
    </>
  );
}
