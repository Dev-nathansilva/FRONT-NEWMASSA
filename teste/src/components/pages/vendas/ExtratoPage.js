import { Flex, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { BsFileEarmarkBarGraphFill } from "react-icons/bs";
import { FiList } from "react-icons/fi";
import { PiPresentationChartFill } from "react-icons/pi";

export default function ExtratoPage() {
  return (
    <div>
      {/* CABEÇALHO */}
      <Flex justify="space-between" align="center" mb={5}>
        <VStack align="start">
          <HStack>
            <Icon as={FiList} w={6} h={6} />
            <Text className="title-session" fontSize="xl" fontWeight="bold">
              Extrato de Vendas
            </Text>
          </HStack>
          <Text className="subtitle-session">Veja o Extrato das vendas</Text>
        </VStack>
      </Flex>
    </div>
  );
}
