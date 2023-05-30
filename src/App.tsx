import "./App.css";
import { MapProvider } from "./context/map-context";
import {
  AppShell,
  Header,
  MantineProvider,
  Title,
  Image,
  Flex,
} from "@mantine/core";
import { SideBar } from "./components/Sidebar";
import { ArcGISMap } from "./components/Map";
import * as intl from "@arcgis/core/intl";
import logo1 from "./assets/vilnius2.png";

function App() {
  intl.setLocale("lt");
  return (
    <MapProvider>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          fontFamily: "Open Sans, sans-serif",
        }}
      >
        <AppShell
          padding={0}
          navbar={<SideBar />}
          header={
            <Header height={60} bg="#f8f8f8">
              <Flex align="center" h="100%">
                <Image maw={40} src={logo1} ml={20} mr={10} />
                <Title order={3} fw={400} transform="uppercase">
                  Vilniaus miesto inžinerinių tinklų kortelės
                </Title>
              </Flex>
            </Header>
          }
          styles={(theme) => ({
            main: {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          })}
        >
          <ArcGISMap />
        </AppShell>
      </MantineProvider>
    </MapProvider>
  );
}

export default App;
