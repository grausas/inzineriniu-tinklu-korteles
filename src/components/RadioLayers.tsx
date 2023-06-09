import { SegmentedControl, Flex } from "@mantine/core";

export function RadioLayers({ handleRadioLayers, loading }: any) {
  return (
    <Flex pb={10} px={10}>
      <SegmentedControl
        size="sm"
        color="blue"
        w="100%"
        defaultValue="staciakampes"
        disabled={loading}
        data={[
          { value: "staciakampes", label: "Stačiakampės" },
          { value: "trapecines", label: "Trapecinės" },
          { value: "visos", label: "Visos" },
        ]}
        onChange={handleRadioLayers}
      />
    </Flex>
  );
}
