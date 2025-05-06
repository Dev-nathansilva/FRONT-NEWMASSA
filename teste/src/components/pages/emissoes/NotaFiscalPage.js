import { Flex, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { BsFileEarmarkBarGraphFill } from "react-icons/bs";
import { PiPresentationChartFill } from "react-icons/pi";
import { RiFilePaper2Line } from "react-icons/ri";

export default function NotaFiscalPage() {
  return (
    <div>
      {/* CABEÇALHO */}
      <Flex justify="space-between" align="center" mb={5}>
        <VStack align="start">
          <HStack>
            <Icon as={RiFilePaper2Line} w={6} h={6} />
            <Text className="title-session" fontSize="xl" fontWeight="bold">
              Nota Fiscal
            </Text>
          </HStack>
          <Text className="subtitle-session">
            Visualize todas as Nota Fiscal
          </Text>
        </VStack>
      </Flex>
    </div>
  );
}
