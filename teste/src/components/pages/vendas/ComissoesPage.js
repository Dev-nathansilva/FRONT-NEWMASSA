import { Flex, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { BsFileEarmarkBarGraphFill } from "react-icons/bs";
import { MdPaid } from "react-icons/md";
import { PiPresentationChartFill } from "react-icons/pi";

export default function ComissoesPage() {
  return (
    <div>
      {/* CABEÇALHO */}
      <Flex justify="space-between" align="center" mb={5}>
        <VStack align="start">
          <HStack>
            <Icon as={MdPaid} w={6} h={6} />
            <Text className="title-session" fontSize="xl" fontWeight="bold">
              Comissões
            </Text>
          </HStack>
          <Text className="subtitle-session">
            Veja as comissões dos vendedores
          </Text>
        </VStack>
      </Flex>
    </div>
  );
}
