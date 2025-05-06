import { Flex, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { BsFileEarmarkBarGraphFill } from "react-icons/bs";
import { FaBarcode } from "react-icons/fa6";
import { PiPresentationChartFill } from "react-icons/pi";

export default function BoletoPage() {
  return (
    <div>
      {/* CABEÇALHO */}
      <Flex justify="space-between" align="center" mb={5}>
        <VStack align="start">
          <HStack>
            <Icon as={FaBarcode} w={6} h={6} />
            <Text className="title-session" fontSize="xl" fontWeight="bold">
              Boleto
            </Text>
          </HStack>
          <Text className="subtitle-session">Visualize os Boleto</Text>
        </VStack>
      </Flex>
    </div>
  );
}
