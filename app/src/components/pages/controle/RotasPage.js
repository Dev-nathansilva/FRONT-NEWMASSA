import {
  Box,
  Flex,
  HStack,
  Icon,
  Text,
  VStack,
  Badge,
  SimpleGrid,
} from "@chakra-ui/react";
import { BsFileEarmarkBarGraphFill } from "react-icons/bs";
import { FaRoute, FaTruck } from "react-icons/fa";
import { Button } from "rsuite";

const rotasAtivas = [
  {
    codigo: 17,
    motorista: "JOAQUIM DA SILVA",
    data: "21/01/2025",
    produtos: 200,
    situacao: "pedido entregue",
    cor: "green.100",
  },
  {
    codigo: 16,
    motorista: "JOAQUIM DA SILVA",
    data: "21/01/2025",
    produtos: 200,
    situacao: "não finalizado",
    cor: "red.100",
  },
  {
    codigo: 15,
    motorista: "JOAQUIM DA SILVA",
    data: "21/01/2025",
    produtos: 200,
    situacao: "parcialmente entregue",
    cor: "orange.100",
  },
  {
    codigo: 14,
    motorista: "JOAQUIM DA SILVA",
    data: "21/01/2025",
    produtos: 200,
    situacao: "em andamento",
    cor: "blue.100",
  },
];

export default function RotasPage() {
  return (
    <div>
      {/* CABEÇALHO */}
      <Flex justify="space-between" align="center" mb={5}>
        <VStack align="start">
          <HStack>
            <Icon as={FaRoute} w={6} h={6} />
            <Text className="title-session" fontSize="xl" fontWeight="bold">
              Rotas
            </Text>
          </HStack>
          <Text className="subtitle-session">Veja as Rotas</Text>
        </VStack>
      </Flex>

      {/* ROTAS ATIVAS */}
      <VStack align="start" gap={4}>
        <HStack>
          <Text fontWeight="bold">Ativas</Text>
          <Badge
            borderRadius="full"
            className="!bg-gray-200 !text-[17px] !w-[30px] !h-[30px] !flex !items-center !justify-center"
          >
            {rotasAtivas.length}
          </Badge>
        </HStack>

        <SimpleGrid columns={[1, 2, 3, 4]} gap={4} width="100%">
          {rotasAtivas.map((rota) => (
            <Box
              key={rota.codigo}
              className="!p-4"
              borderWidth="1px"
              borderRadius="md"
              boxShadow="sm"
              bg="white"
            >
              <HStack justify="space-between" mb={2}>
                <Text fontSize="sm" fontWeight="bold">
                  Código {rota.codigo}
                </Text>
                <Icon as={FaTruck} w={5} h={5} />
              </HStack>

              <VStack align="start" spacing={1}>
                <Box>
                  <Text fontSize="xs" color="gray.500">
                    Motorista
                  </Text>
                  <Text fontSize="sm" fontWeight="bold">
                    {rota.motorista}
                  </Text>
                </Box>

                <Box>
                  <Text fontSize="xs" color="gray.500">
                    Pedidos em Rotas
                  </Text>
                  <Button
                    gap={1}
                    colorPalette="gray"
                    variant="surface"
                    className="!flex gap-3"
                  >
                    <BsFileEarmarkBarGraphFill />
                    Ver todos os pedidos
                  </Button>
                </Box>

                <Box>
                  <Text fontSize="xs" color="gray.500">
                    Data
                  </Text>
                  <Text fontSize="sm">{rota.data}</Text>
                </Box>

                <Box>
                  <Text fontSize="xs" color="gray.500">
                    Qtd. de Produtos
                  </Text>
                  <Text fontSize="sm">{rota.produtos}</Text>
                </Box>

                <Box>
                  <Text fontSize="xs" color="gray.500">
                    Situação
                  </Text>
                  <Badge
                    bg={rota.cor}
                    borderRadius="full"
                    px={2}
                    py={1}
                    fontSize="xs"
                  >
                    {rota.situacao}
                  </Badge>
                </Box>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </VStack>

      {/* FINALIZADAS */}
      <VStack align="start" spacing={4} mt={10}>
        <HStack>
          <Text fontWeight="bold">Finalizadas</Text>
          <Badge
            borderRadius="full"
            className="!bg-gray-200 !text-[17px] !w-[30px] !h-[30px] !flex !items-center !justify-center"
          >
            0
          </Badge>
        </HStack>
      </VStack>
    </div>
  );
}
