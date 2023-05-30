import { Paper, Flex, Text, Image } from "@mantine/core";

interface Card {
  name: string;
  number: string;
  color?: string;
  handleOnClick?: any;
}
import pdfLogo from "../assets/pdf.svg";

export function Card({ name, number, color, handleOnClick }: Card) {
  return (
    <Paper
      w="100%"
      shadow="xs"
      radius="xs"
      mb={2}
      withBorder
      sx={{
        border: "none",
        "&:hover": {
          backgroundColor: "#eee",
          cursor: "pointer",
        },
      }}
    >
      <Flex justify="space-between" align="center" direction="row" h="100%">
        <Text
          color={color}
          fw={500}
          w="100%"
          py={6}
          px="xs"
          onClick={() => handleOnClick(number)}
        >
          {number}/{name}
        </Text>
        <Text>
          <a
            href={`https://vpdpdata01.blob.core.windows.net/kdb-korteles/data/${number}/${number}_${name}.pdf`}
            target="_blank"
          >
            <Image maw={30} src={pdfLogo} alt="Pdf image" />
          </a>
        </Text>
      </Flex>
    </Paper>
  );
}
