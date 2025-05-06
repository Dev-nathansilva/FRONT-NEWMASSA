import { Flex, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { FaFileInvoiceDollar } from "react-icons/fa6";

export default function ContasPage() {
  return (
    <div>
      {/* CABEÇALHO */}
      <Flex justify="space-between" align="center" mb={5}>
        <VStack align="start">
          <HStack>
            <Icon as={FaFileInvoiceDollar} w={6} h={6} />
            <Text className="title-session" fontSize="xl" fontWeight="bold">
              Contas
            </Text>
          </HStack>
          <Text className="subtitle-session">Veja as Contas</Text>
        </VStack>
      </Flex>
    </div>
  );
}
