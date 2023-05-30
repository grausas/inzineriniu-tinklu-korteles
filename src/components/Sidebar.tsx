import {
  Navbar,
  ScrollArea,
  Input,
  Text,
  Flex,
  Loader,
  Pagination,
  Image,
  Button,
  Tooltip,
} from "@mantine/core";
import { Card } from "./Card";
import { RadioLayers } from "./RadioLayers";
import { Notification } from "./Notification";
import { useEffect, useContext, useState } from "react";
import { MapContext } from "../context/map-context";
import { queryFeatures } from "../queryFeatures";
import { queryFeaturesCount } from "../queryFeaturesCount";
import { featureLayerSt, featureLayerTr } from "../layers";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import resetIcon from "../assets/reset-svgrepo-com.svg";

export function SideBar() {
  const [data, setData] = useState<__esri.Graphic[]>([]);
  const [error, setError] = useState(false);
  const [notification, setNotification] = useState(false);
  const [filteredList, setFilteredList] = useState<__esri.Graphic[]>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectTerm, setSelectTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [onClickIds, setOnClickIds] =
    useState<{ text: string; title: string }[]>();
  const { view } = useContext(MapContext);
  const itemsPerPage = 100;
  const [page, setPage] = useState(1);
  const [reset, setReset] = useState(false);
  const [featureCount, setFeatureCount] = useState(0);

  // query features count
  const queryCount = async (layer: __esri.FeatureLayer) => {
    try {
      const features = await queryFeaturesCount(layer);
      if (selectTerm === "visos") {
        setFeatureCount(features);
      } else {
        setFeatureCount(features);
      }
    } catch (err) {
      setError(true);
      console.log("erorr", err);
    }
  };

  useEffect(() => {
    if (selectTerm === "trapecines") {
      queryCount(featureLayerTr());
    } else if (selectTerm === "visos") {
      setFeatureCount(0);
      queryCount(featureLayerSt());
      queryCount(featureLayerTr());
    } else {
      queryCount(featureLayerSt());
    }
  }, [selectTerm]);

  // reset notification after some time
  useEffect(() => {
    const timeId = setTimeout(() => {
      setNotification(false);
    }, 3000);

    return () => {
      clearTimeout(timeId);
    };
  }, [notification]);

  // filter features by id's
  useEffect(() => {
    const ids = onClickIds?.map((id) => {
      return id.text;
    });

    const results = data.filter((obj) => {
      const values = Object.values(obj.attributes);
      return ids?.some((val) => values.includes(val));
    });

    if (results.length > 0) {
      setFilteredList(results);
    }
  }, [onClickIds]);

  // on map click get ids from clicked square and filter them
  useEffect(() => {
    setNotification(false);
    if (view) {
      view.popup.autoOpenEnabled = false;
      view.on("click", (event) => {
        if (view.zoom < 11) {
          return setNotification(true);
        }
        setPage(1);
        view
          .hitTest(event, { include: view.map.layers })
          .then(({ results }) => {
            const result = results;
            const arr: { text: string; title: string }[] = [];
            if (result) {
              result.map((item: any) => {
                if (
                  item.layer.id === "staciakampes" ||
                  item.layer.id === "trapecines"
                ) {
                  setReset(true);

                  if (item.layer.id === "staciakampes") {
                    const nomenklatura =
                      item.graphic.attributes["KDB500V.ST_500.NOM"];

                    arr.push({
                      text: nomenklatura,
                      title: "stačiakampės",
                    });
                  } else if (item.layer.id === "trapecines") {
                    const nomenklatura =
                      item.graphic.attributes["KDB500V.TRAPEC_500.NR_SKAIC"];

                    arr.push({
                      text: nomenklatura,
                      title: "trapecinės",
                    });
                  }
                }
              });
            }
            setOnClickIds(arr);
          });
      });
    }
  }, [view]);

  // search by typed value
  const handleChange = (e: any) => {
    setSearchTerm(e.target.value);
  };

  // select layers
  const handleSelectChange = (value: string) => {
    setFilteredList([]);
    setSearchTerm("");
    setSelectTerm(value);
  };

  // query features
  const query = async (layer: __esri.FeatureLayer) => {
    setLoading(true);
    try {
      const features = await queryFeatures(layer);
      if (selectTerm === "visos") {
        setData((prev) => [...prev, ...features]);
      } else {
        setData(features);
      }
    } catch (err) {
      setError(true);
      console.log("erorr", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (searchTerm.length > 0) {
      setReset(true);
      const results = data.filter((item) => {
        if (item.attributes["KDB500V.TRAPEC_500.NR_SKAIC"]) {
          const att = item.attributes["KDB500V.TRAPEC_500.NR_SKAIC"].toString();
          return att.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (item.attributes["KDB500V.ST_500.NOM"]) {
          const att = item.attributes["KDB500V.ST_500.NOM"].toString();
          return att.toLowerCase().includes(searchTerm.toLowerCase());
        }
      });
      setFilteredList(results);
    } else {
      setFilteredList(data);
    }
  }, [searchTerm, data]);

  // filter features on map
  const handleFilterOnMap = (e: string) => {
    const queryParamsSt = {
      where: "KDB500V.ST_500.NOM = '" + e + "'",
    };
    const queryParamsTr = {
      where: "KDB500V.TRAPEC_500.NR_SKAIC = " + e,
    };
    reactiveUtils
      .whenOnce(() => view?.ready)
      .then(() => {
        setReset(true);
        view?.map.layers.map((layer) => {
          view?.whenLayerView(layer).then((layerView: any) => {
            layerView.featureEffect = {
              filter:
                layer.id === "staciakampes" ? queryParamsSt : queryParamsTr,
              excludedEffect: "opacity(25%)",
              includedEffect: "drop-shadow(1px, 1px, 2px)",
            };
          });
        });
      });
  };

  // query features if select value changed
  useEffect(() => {
    if (selectTerm === "trapecines") {
      query(featureLayerTr());
      view?.map.removeAll();
      view?.map.layers.add(featureLayerTr());
    } else if (selectTerm === "visos") {
      setData([]);
      query(featureLayerSt());
      query(featureLayerTr());
      view?.map.removeAll();
      view?.map.layers.addMany([featureLayerSt(), featureLayerTr()]);
    } else {
      view?.map.removeAll();
      query(featureLayerSt());
      view?.map.layers.add(featureLayerSt());
    }

    // filterLayers(selectTerm);
  }, [selectTerm]);

  // reset all features
  const resetFilters = () => {
    if (view) {
      view?.map.layers.map((layer) => {
        view?.whenLayerView(layer).then((layerView: any) => {
          layerView.featureEffect = {
            filter: "1=1",
            excludedEffect: "opacity(100%)",
            includedEffect: "",
          };
        });
      });
    }
    if (searchTerm.length > 0) {
      setSearchTerm("");
    }
    setFilteredList(data);
    setReset(false);
  };

  return (
    <Navbar width={{ base: 320 }} bg="#f8f8f8">
      {notification && (
        <Notification
          text="Norėdami paspasuti ant kortelės, priartinkite žemėlapį"
          title="Klaida"
        />
      )}
      <Flex
        direction="row"
        h="40px"
        bg="#ffffff"
        px="xs"
        mb={10}
        justify="space-between"
        align="center"
      >
        <Flex direction="row" bg="#ffffff">
          Rodomos
          <Text fw={500} px={3}>
            {!loading && featureCount ? (
              featureCount
            ) : (
              <Loader color="red" size="xs" mx={3} variant="dots" mt={10} />
            )}
          </Text>
          kortelės
        </Flex>
        {reset && (
          <Tooltip bg="blue" label="Panaikinti filtrus">
            <Button
              onClick={resetFilters}
              size="xs"
              bg="none"
              sx={{
                border: "none",
                "&:hover": {
                  backgroundColor: "#eee",
                  border: "0px solid #fff",
                },
              }}
            >
              <Image src={resetIcon} maw={20} alt="reset-icon" />
            </Button>
          </Tooltip>
        )}
      </Flex>
      <Navbar.Section>
        <Input
          placeholder="Ieškoti kortelės pagal numerį"
          value={searchTerm}
          onChange={handleChange}
          mb={10}
          px="xs"
        />

        <RadioLayers handleRadioLayers={handleSelectChange} />
        <ScrollArea h="calc(100vh - 280px)" type="always" px="xs">
          <Flex direction="column" align="center" justify="center">
            {error && (
              <Text align="center" p={10} mt={40} fw={500} fz="xl" color="red">
                Šiuo metu serveriai nepasiekiami, pabandykite vėliau
              </Text>
            )}
            {!loading ? (
              filteredList
                ?.slice(
                  (page - 1) * itemsPerPage,
                  itemsPerPage * (page - 1) + itemsPerPage
                )
                .map((feature, index) => (
                  <Card
                    handleOnClick={handleFilterOnMap}
                    key={index}
                    name={
                      feature.attributes["KDB500V.INZ_KORTEL.NR_PL_T"] ||
                      feature.attributes["KDB500V.INZ_KORTEL.NR_PL_S"]
                    }
                    number={
                      feature.attributes["KDB500V.TRAPEC_500.NR_SKAIC"] ||
                      feature.attributes["KDB500V.ST_500.NOM"]
                    }
                  />
                ))
            ) : (
              <Loader color="red" size="lg" variant="dots" mt={50} />
            )}
          </Flex>
        </ScrollArea>
      </Navbar.Section>
      <Flex py={20} pos="sticky" bottom={0} bg="#ffffff" justify="center">
        <Pagination
          color="blue"
          size="sm"
          value={page}
          onChange={setPage}
          total={featureCount ? Math.ceil(featureCount / itemsPerPage) : 1}
          disabled={loading}
        />
      </Flex>
    </Navbar>
  );
}
