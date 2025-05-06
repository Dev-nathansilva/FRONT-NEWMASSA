import {
  Box,
  HStack,
  Icon,
  Text,
  VStack,
  Button,
  Select,
  Flex,
  Checkbox,
  Table,
  TableRoot,
  TableHeader,
  TableRow,
  TableColumnHeader,
  TableBody,
  TableCell,
  Input,
  Badge,
} from "@chakra-ui/react";
import { PiPresentationChartFill } from "react-icons/pi";
import { BsPersonCircle } from "react-icons/bs";
import { FiEye, FiCalendar, FiUsers } from "react-icons/fi";

const data = [
  {
    id: 1,
    codigo: "--",
    tipo: "--",
    data: "--",
    resumo: "---",
    status: "---",
  },
];

export default function CRMPage() {
  return (
    <Box>
      {/* Cabeçalho */}
      <Flex justify="space-between" align="center" mb={8}>
        <VStack align="start" spacing={1}>
          <HStack>
            <Icon as={FiUsers} w={6} h={6} />
            <Text fontSize="2xl" fontWeight="bold">
              CRM - Relacionamento com os clientes
            </Text>
          </HStack>
          <Text fontSize="sm" color="gray.500">
            Veja o relacionamento com os clientes
          </Text>
        </VStack>
      </Flex>

      {/* Botões */}
      <HStack spacing={4} mb={6}>
        <Button variant="surface" colorPalette="gray" className="!rounded-2xl">
          Histórico de Interações
        </Button>
        <Button variant="surface" colorPalette="gray" className="!rounded-2xl">
          Funil de Vendas
        </Button>
      </HStack>

      {/* Filtros */}
      <Flex
        bg="gray.50"
        p={4}
        borderRadius="lg"
        align="center"
        justify="space-between"
        mb={6}
        flexWrap="wrap"
        gap={4}
      >
        <HStack spacing={3}>
          <Icon as={BsPersonCircle} boxSize={6} />
          <Input placeholder="SELECIONE UM CLIENTE" w="250px" />
        </HStack>

        <HStack className="!flex ! gap-3 !items-center">
          <Text>Status</Text>
          <Text w="120px" className="!m-0">
            {" "}
            ---{" "}
          </Text>
        </HStack>

        <HStack spacing={3}>
          <Icon as={FiCalendar} boxSize={4} />
          <Text>Última Interação a 0 dias (-- / --)</Text>
        </HStack>
      </Flex>

      {/* Tabela */}
      <Box bg="white" borderRadius="lg" boxShadow="sm" overflowX="auto">
        <Table.Root size="sm" width="100%">
          <Table.Header bg="gray.50">
            <Table.Row>
              <Table.ColumnHeader w="40px" className="!p-5" />
              <Table.ColumnHeader
                fontWeight="semibold"
                color="gray.600"
                className="!p-5"
              >
                Código
              </Table.ColumnHeader>
              <Table.ColumnHeader
                fontWeight="semibold"
                color="gray.600"
                className="!p-5"
              >
                Tipo de Interação
              </Table.ColumnHeader>
              <Table.ColumnHeader
                fontWeight="semibold"
                color="gray.600"
                className="!p-5"
              >
                Data
              </Table.ColumnHeader>
              <Table.ColumnHeader
                fontWeight="semibold"
                color="gray.600"
                className="!p-5"
              >
                Resumo
              </Table.ColumnHeader>
              <Table.ColumnHeader
                fontWeight="semibold"
                color="gray.600"
                className="!p-5"
              >
                Status
              </Table.ColumnHeader>
              <Table.ColumnHeader
                textAlign="right"
                fontWeight="semibold"
                color="gray.600"
                className="!p-5"
              >
                Detalhes
              </Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((item, index) => (
              <Table.Row
                key={item.id}
                _hover={{ bg: "gray.50" }}
                bg={index % 2 === 0 ? "white" : "gray.25"}
                transition="background-color 0.2s"
              >
                <Table.Cell w="40px" className="!p-5" />
                <Table.Cell className="!p-5" minW="100px">
                  {item.codigo}
                </Table.Cell>
                <Table.Cell className="!p-5">{item.tipo}</Table.Cell>
                <Table.Cell className="!p-5">{item.data}</Table.Cell>
                <Table.Cell className="!p-5">{item.resumo}</Table.Cell>
                <Table.Cell className="!p-5">
                  <Badge colorPalette={item.status === "Ativo" ? "green" : ""}>
                    {item.status}
                  </Badge>
                </Table.Cell>
                <Table.Cell className="!p-5" textAlign="right">
                  <Icon
                    as={FiEye}
                    boxSize={5}
                    color="gray.600"
                    cursor="pointer"
                  />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </Box>
    </Box>
  );
}
