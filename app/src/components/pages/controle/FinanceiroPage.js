import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Select,
  Text,
  VStack,
  Input,
  SimpleGrid,
  NativeSelect,
} from "@chakra-ui/react";
import { FaMoneyBillWave, FaFilter, FaPlus } from "react-icons/fa";
import { FiChevronDown } from "react-icons/fi";

export default function FinanceiroPage() {
  const thStyle = {
    padding: "12px",
    textAlign: "left",
    fontWeight: 600,
    color: "#333",
    borderBottom: "1px solid #ddd",
  };

  const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #eee",
    color: "#333",
  };

  const iconButton = {
    background: "none",
    border: "none",
    cursor: "pointer",
    marginRight: "8px",
    fontSize: "16px",
  };

  return (
    <Box p={6}>
      {/* CABEÇALHO */}
      <Flex justify="space-between" align="center" mb={5}>
        <VStack align="start" spacing={1}>
          <HStack spacing={2}>
            <Icon as={FaMoneyBillWave} w={6} h={6} />
            <Text fontSize="xl" fontWeight="bold">
              Controle Financeiro
            </Text>
          </HStack>
          <Text color="gray.500">Veja o Controle Financeiro</Text>
        </VStack>

        {/* Período */}
        <HStack gap={2} flexWrap="wrap">
          <Flex align="center" gap={1}>
            <Text fontWeight="medium" whiteSpace="nowrap">
              Data Inicial
            </Text>
            <Input type="date" size="sm" maxW="150px" />
          </Flex>

          <Flex align="center" gap={1}>
            <Text fontWeight="medium" whiteSpace="nowrap">
              Data Final
            </Text>
            <Input type="date" size="sm" maxW="150px" />
          </Flex>
        </HStack>
      </Flex>

      {/* SALDOS E CARDS */}
      <SimpleGrid columns={[1, 2, 4]} gap={4} mb={4}>
        {/* Conta */}
        <Box p={4} rounded="md" shadow="sm">
          <Text fontWeight="bold">Conta</Text>
          <NativeSelect.Root defaultValue="principal">
            <NativeSelect.Field>
              <option value="principal">Conta Principal</option>
              <option value="2">Option 2</option>
            </NativeSelect.Field>
          </NativeSelect.Root>

          <Text mt={3} fontSize="lg" fontWeight="bold">
            R$ 85,00
          </Text>
          <Text fontSize="sm" color="gray.500">
            Saldo da conta
          </Text>
        </Box>

        {/* Contas a Receber */}
        <Box p={4} rounded="md" shadow="sm">
          <Text fontWeight="bold" mb={2}>
            Contas a Receber
          </Text>
          <Text color="green.500" fontWeight="bold">
            R$ 37.560,88
          </Text>
          <Box bg="gray.200" h="6px" mt={2} borderRadius="md">
            <Box bg="green.500" h="6px" w="75%" borderRadius="md" />
          </Box>
          <Text fontSize="xs" mt={1}>
            R$ 50.000,00
          </Text>
        </Box>

        {/* Contas a Pagar */}
        <Box p={4} rounded="md" shadow="sm">
          <Text fontWeight="bold" mb={2}>
            Contas a Pagar
          </Text>
          <Text color="red.500" fontWeight="bold">
            R$ 20.333,56
          </Text>
          <Box bg="gray.200" h="6px" mt={2} borderRadius="md">
            <Box bg="red.500" h="6px" w="100%" borderRadius="md" />
          </Box>
          <Text fontSize="xs" mt={1}>
            R$ 20.333,56
          </Text>
        </Box>

        {/* Total Geral */}
        <Box
          p={4}
          rounded="md"
          shadow="sm"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <VStack spacing={1}>
            <Text fontSize="sm" color="gray.500">
              Total Geral
            </Text>
            <Text fontSize="lg" fontWeight="bold">
              R$ 29.666,44
            </Text>
          </VStack>
        </Box>
      </SimpleGrid>

      {/* Ações e Filtros */}
      <Flex justify="space-between" align="center" mb={4}>
        <HStack spacing={2}>
          <Button
            size="sm"
            colorPalette="red"
            className="!text-white !rounded-2xl"
          >
            <FaFilter /> Contas a pagar
          </Button>
          <Button
            size="sm"
            colorPalette="green"
            variant="solid"
            className="!text-white !rounded-2xl"
          >
            Contas a receber
          </Button>
          <Button size="sm" isDisabled colorPalette="gray" variant="surface">
            Vencidas
          </Button>
          <Button size="sm" isDisabled colorPalette="gray" variant="surface">
            Extrato
          </Button>
        </HStack>
        <Button
          size="sm"
          colorPalette="blue"
          className="!text-white !rounded-2xl"
        >
          <FaPlus /> Nova Conta
        </Button>
      </Flex>

      {/* TABELA */}

      <Box mt={4} overflowX="auto">
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
            background: "#fff",
            borderRadius: "8px",
            overflow: "hidden",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <thead style={{ background: "#f5f5f5" }}>
            <tr>
              <th style={thStyle}>Data</th>
              <th style={thStyle}>Descrição</th>
              <th style={thStyle}>Categoria</th>
              <th style={thStyle}>Parcela</th>
              <th style={thStyle}>Valor</th>
              <th style={thStyle}>Situação</th>
              <th style={thStyle}>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={tdStyle}>20/01/2025</td>
              <td style={tdStyle}>compra do nathan</td>
              <td style={tdStyle}>compra</td>
              <td style={tdStyle}>-</td>
              <td style={{ ...tdStyle, color: "red", fontWeight: "bold" }}>
                R$ 20.333,56
              </td>
              <td style={tdStyle}>
                <span
                  style={{
                    backgroundColor: "#facc15",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                    color: "#000",
                  }}
                >
                  em aberto
                </span>
              </td>
              <td style={tdStyle}>
                <button style={iconButton}>🔄</button>
                <button style={iconButton}>❤️</button>
                <button style={iconButton}>🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </Box>
    </Box>
  );
}
