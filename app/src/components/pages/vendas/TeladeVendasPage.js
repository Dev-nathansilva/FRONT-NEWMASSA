import { Flex, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { BsFileEarmarkBarGraphFill } from "react-icons/bs";
import { FaShoppingCart } from "react-icons/fa";
import { PiPresentationChartFill } from "react-icons/pi";

export default function TeladeVendasPage() {
  return (
    <div>
      {/* CABEÇALHO */}
      <Flex justify="space-between" align="center" mb={5}>
        <VStack align="start">
          <HStack>
            <Icon as={FaShoppingCart} w={6} h={6} />
            <Text className="title-session" fontSize="xl" fontWeight="bold">
              Vendas
            </Text>
          </HStack>
          <Text className="subtitle-session">Visualize todas as vendas</Text>
        </VStack>
      </Flex>
    </div>
  );
}
