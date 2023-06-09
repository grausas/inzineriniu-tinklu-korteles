import "./App.css";
import { MapProvider } from "./context/map-context";
import {
  AppShell,
  Header,
  MantineProvider,
  Title,
  Image,
  Flex,
  Button,
} from "@mantine/core";
import { SideBar } from "./components/Sidebar";
import { ArcGISMap } from "./components/Map";
import * as intl from "@arcgis/core/intl";
import logo1 from "./assets/vilnius2.png";
import link from "./assets/link.png";

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
              <Flex align="center" h="100%" justify="space-between" px={10}>
                <Flex align="center">
                  <Image maw={40} src={logo1} mr={10} alt="logo" />
                  <Title order={3} fw={400} transform="uppercase">
                    Vilniaus miesto inžinerinių tinklų kortelės
                  </Title>
                </Flex>
                <a
                  href="http://zemelapiai.vplanas.lt/Suliniu_korteles/"
                  target="_blank"
                >
                  <Button variant="default" px={10}>
                    <Image maw={15} src={link} alt="logo" mr={5} />
                    Sena kortelių nuoroda
                  </Button>
                </a>
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
