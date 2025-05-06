import {
  Box,
  Flex,
  HStack,
  Icon,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";
import { PiPresentationChartFill } from "react-icons/pi";
import { BsPieChartFill } from "react-icons/bs";

const relatorios = [
  "Clientes",
  "Fornecedores",
  "Produtos",
  "Vendedores",
  "Vendas",
  "Estoque",
  "Pedido de Compra",
  "Ordem de Produção",
];

export default function RelatoriosPage() {
  return (
    <Box>
      {/* CABEÇALHO */}
      <Flex justify="space-between" align="center" mb={8}>
        <VStack align="start" spacing={1}>
          <HStack>
            <Icon as={PiPresentationChartFill} w={6} h={6} />
            <Text fontSize="2xl" fontWeight="bold">
              Relatórios
            </Text>
          </HStack>
          <Text fontSize="sm" color="gray.500">
            Selecione um relatório para visualização
          </Text>
        </VStack>
      </Flex>

      {/* GRID DE RELATÓRIOS */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={4}>
        {relatorios.map((nome) => (
          <Box
            key={nome}
            bg="white"
            borderRadius="xl"
            boxShadow="sm"
            p={5}
            _hover={{ boxShadow: "md", transform: "translateY(-2px)" }}
            transition="all 0.2s"
            cursor="pointer"
          >
            <VStack align="start" spacing={3}>
              <Text fontSize="sm" color="gray.400">
                Relatório
              </Text>
              <HStack spacing={3}>
                <Icon as={BsPieChartFill} boxSize={5} />
                <Text fontSize="md" fontWeight="medium">
                  {nome}
                </Text>
              </HStack>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
