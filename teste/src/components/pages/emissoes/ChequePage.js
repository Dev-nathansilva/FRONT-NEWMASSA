import { Flex, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { BsFileEarmarkBarGraphFill } from "react-icons/bs";
import { PiPresentationChartFill } from "react-icons/pi";
import { RiBankCardLine } from "react-icons/ri";

export default function ChequePage() {
  return (
    <div>
      {/* CABEÇALHO */}
      <Flex justify="space-between" align="center" mb={5}>
        <VStack align="start">
          <HStack>
            <Icon as={RiBankCardLine} w={6} h={6} />
            <Text className="title-session" fontSize="xl" fontWeight="bold">
              Cheque
            </Text>
          </HStack>
          <Text className="subtitle-session">Visualize os Cheques</Text>
        </VStack>
      </Flex>
    </div>
  );
}
