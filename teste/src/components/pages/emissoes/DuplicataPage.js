import { Flex, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { BsFileEarmarkBarGraphFill } from "react-icons/bs";
import { MdAssignment } from "react-icons/md";
import { PiPresentationChartFill } from "react-icons/pi";

export default function DuplicataPage() {
  return (
    <div>
      {/* CABEÇALHO */}
      <Flex justify="space-between" align="center" mb={5}>
        <VStack align="start">
          <HStack>
            <Icon as={MdAssignment} w={6} h={6} />
            <Text className="title-session" fontSize="xl" fontWeight="bold">
              Duplicata
            </Text>
          </HStack>
          <Text className="subtitle-session">Visualize as Duplicata</Text>
        </VStack>
      </Flex>
    </div>
  );
}
