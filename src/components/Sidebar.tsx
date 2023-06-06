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
import { useEffect, useContext, useState, SetStateAction } from "react";
import { MapContext } from "../context/map-context";
import { queryFeatures } from "../queries/queryFeatures";
import { queryFeaturesCount } from "../queries/queryFeaturesCount";
import { featuresTable } from "../layers";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";
import resetIcon from "../assets/reset.svg";

export function SideBar() {
  const [data, setData] = useState<__esri.Graphic[]>([]);
  const [error, setError] = useState(false);
  const [notification, setNotification] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectTerm, setSelectTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [onClickIds, setOnClickIds] =
    useState<{ text: string; title: string }[]>();
  const { view } = useContext(MapContext);
  const itemsPerPage = 100;
  const [page, setPage] = useState(1);
  const [reset, setReset] = useState(false);
  const [featureCount, setFeatureCount] = useState(0);
  const [whereParams, setWhereParams] = useState("");
  const defaultWhereParams = "1=1";

  // query features count
  const queryCount = async (
    layer: __esri.FeatureLayer,
    whereParams: string
  ) => {
    try {
      const features = await queryFeaturesCount(layer, whereParams);
      setFeatureCount(features);
    } catch (err) {
      setError(true);
      console.log("erorr", err);
    }
  };

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
    if (onClickIds && onClickIds.length > 0) {
      const params: string[] = [];
      onClickIds?.map((id) => {
        if (id.title === "stačiakampės") {
          params.push("NOMENKL_ST = '" + id.text + "'");
        } else if (id.title === "trapecinės") {
          params.push("NOMENKL_TRA = '" + id.text + "'");
        }
        setReset(true);
      });
      setWhereParams(params.join(" OR "));
    }
  }, [onClickIds]);

  // on map click get ids from clicked square and filter them
  useEffect(() => {
    setNotification(false);
    if (view) {
      // view.popup.autoOpenEnabled = false;
      view.on("click", (event) => {
        if (view.zoom < 11) {
          return setNotification(true);
        }
        setPage(1);
        view
          .hitTest(event, { include: view.map.layers })
          .then(({ results }) => {
            const arr: { text: string; title: string }[] = [];
            if (results) {
              results.map((result: any) => {
                if (
                  result.layer.id === "staciakampes" ||
                  result.layer.id === "trapecines"
                ) {
                  if (result.layer.id === "staciakampes") {
                    const nomenklatura = result.graphic.attributes.STAC_NOM;
                    arr.push({
                      text: nomenklatura,
                      title: "stačiakampės",
                    });
                  } else if (result.layer.id === "trapecines") {
                    const nomenklatura = result.graphic.attributes.TRAP_NOM;
                    arr.push({
                      text: nomenklatura,
                      title: "trapecinės",
                    });
                  }
                } else {
                  view.when(() => {
                    const popupTemplate = result.layer.createPopupTemplate();
                    result.layer.popupTemplate = popupTemplate;
                  });
                  view.popup.open({
                    featureMenuOpen: true,
                    location: event.mapPoint,
                  });
                }
              });
            }
            setOnClickIds(arr);
          });
      });
    }
  }, [view]);

  // search by typed value
  const handleChange = (e: { target: { value: SetStateAction<string> } }) => {
    setSearchTerm(e.target.value);
  };

  // select layer
  const handleSelectChange = (value: string) => {
    resetFilters();
    setSelectTerm(value);
  };

  // query features
  const query = async (
    layer: __esri.FeatureLayer,
    page: number,
    whereParams: string
  ) => {
    setError(false);
    setLoading(true);
    setData([]);
    try {
      const features = await queryFeatures(layer, page, whereParams);
      setData(features);
    } catch (err) {
      setError(true);
      console.log("erorr", err);
    }
    setLoading(false);
  };

  // search features by input value
  useEffect(() => {
    if (searchTerm.length >= 2) {
      const search = searchTerm;
      let params: string;
      if (selectTerm === "trapecines") {
        params = "NOMENKL_TRA LIKE '%" + search + "%'";
      } else if (selectTerm === "staciakampes") {
        params = "NOMENKL_ST LIKE '%" + search + "%'";
      } else {
        params =
          "NOMENKL_ST LIKE '%" +
          search +
          "%'" +
          " OR " +
          "NOMENKL_TRA LIKE '%" +
          search +
          "%'";
      }
      const getData = setTimeout(() => {
        setWhereParams(params);
        setReset(true);
      }, 1000);
      return () => clearTimeout(getData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

  // filter features on map
  const handleFilterOnMap = (e: string) => {
    const queryParamsSt = {
      where: "STAC_NOM = '" + e + "'",
    };
    const queryParamsTr = {
      where: "TRAP_NOM = " + e,
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

  // add layers to map
  useEffect(() => {
    if (selectTerm === "trapecines") {
      view?.map.layers.map((layer) => {
        if (layer.id === selectTerm) {
          layer.visible = true;
        } else {
          layer.visible = false;
        }
      });
    } else if (selectTerm === "visos") {
      view?.map.layers.map((layer) => {
        if (layer.id === "trapecines" || layer.id === "staciakampes") {
          layer.visible = true;
        } else {
          layer.visible = false;
        }
      });
    } else {
      view?.map.layers.map((layer) => {
        if (layer.id === selectTerm) {
          layer.visible = true;
        } else {
          layer.visible = false;
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectTerm]);

  const queryByLayer = () => {
    let params: string;
    if (whereParams === "") {
      if (selectTerm === "trapecines") {
        params = "NOMENKL_TRA IS NOT NULL";
      } else if (selectTerm === "visos") {
        params = defaultWhereParams;
      } else {
        params = "NOMENKL_ST IS NOT NULL";
      }
      queryCount(featuresTable(), params);
      query(featuresTable(), page - 1, params);
    } else {
      queryCount(featuresTable(), whereParams);
      query(featuresTable(), page - 1, whereParams);
    }
  };

  // query features by selected layer
  useEffect(() => {
    queryByLayer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectTerm, page, whereParams]);

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
    setOnClickIds(undefined);
    setWhereParams("");
    setReset(false);
  };

  return (
    <Navbar width={{ base: 320 }} bg="#f8f8f8">
      {notification && (
        <Notification
          text="Norėdami paspasuti ant kortelės, priartinkite žemėlapį"
          title=""
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
            {!loading ? (
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
              data.length === 0 ? (
                <Text align="center" p={10} mt={40} fw={500} fz="xl">
                  Kortelių nerasta. Pakeiskite sluoksnius arba ieškokite iš
                  naujo.
                </Text>
              ) : (
                data.map((feature, index) => (
                  <Card
                    handleOnClick={handleFilterOnMap}
                    key={index}
                    name={
                      feature.attributes.NR_PL_S || feature.attributes.NR_PL_T
                    }
                    number={
                      feature.attributes.NOMENKL_ST ||
                      feature.attributes.NOMENKL_TRA
                    }
                  />
                ))
              )
            ) : (
              <Loader color="red" size="lg" variant="dots" mt={50} />
            )}
          </Flex>
        </ScrollArea>
      </Navbar.Section>
      <Flex py={20} pos="sticky" bottom={0} bg="#ffffff" justify="center">
        <Pagination
          aria-label="pagination"
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
