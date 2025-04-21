import { Box, Text, Flex, Input, Icon, VStack, HStack } from "@chakra-ui/react";
import { BsFileEarmarkBarGraph } from "react-icons/bs";
import { DateRangePicker, CustomProvider } from "rsuite";
import { useState } from "react";
import ptBR from "rsuite/locales/pt_BR";
import { CgPerformance } from "react-icons/cg";
import MapaFortaleza from "@/components/MapaFortaleza";

import "../../styles/dashboard.css";
import ArrowUpIcon from "@/components/icons/ArrowUpIcon";

import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Bar,
  BarChart,
} from "recharts";

const movimentacoesData = [
  { categoria: "Entrada", valor: 500 },
  { categoria: "Saída", valor: 300 },
  { categoria: "Transferências", valor: 150 },
];

const produtosMaisVendidos = [
  { nome: "Produto A", quantidade: 200 },
  { nome: "Produto B", quantidade: 150 },
  { nome: "Produto C", quantidade: 100 },
  { nome: "Produto D", quantidade: 80 },
];

const salesData = [
  { month: "Jan", vendas: 30 },
  { month: "Fev", vendas: 45 },
  { month: "Mar", vendas: 60 },
  { month: "Abr", vendas: 50 },
  { month: "Mai", vendas: 70 },
  { month: "Jun", vendas: 90 },
  { month: "Jul", vendas: 100 },
  { month: "Ago", vendas: 85 },
  { month: "Set", vendas: 95 },
  { month: "Out", vendas: 110 },
  { month: "Nov", vendas: 120 },
  { month: "Dez", vendas: 130 },
];

const categoryData = [
  { name: "Vendas", value: 400 },
  { name: "Compras", value: 300 },
  { name: "Impostos", value: 300 },
  { name: "Receita Final", value: 200 },
];

const COLORS = ["#5B93FF", "#00C49F", "#FFD66B", "#FF8042"];

export default function DashboardPage() {
  const [value, setValue] = useState(null);

  const [selectedMonth, setSelectedMonth] = useState("");

  return (
    <Box className="container-geral-dash">
      <Flex justify="space-between" align="center" mb={5}>
        <VStack align="start">
          <HStack>
            <Icon as={BsFileEarmarkBarGraph} w={6} h={6} />
            <Text className="title-session" fontSize="xl" fontWeight="bold">
              Visão Geral
            </Text>
          </HStack>
          <Text className="subtitle-session">
            Meça o ROI da sua publicidade e relate o tráfego do site.
          </Text>
        </VStack>

        <CustomProvider locale={ptBR}>
          <DateRangePicker
            id="date-input"
            value={value}
            onChange={setValue}
            placeholder="Selecione o período"
            placement="bottomEnd"
            appearance="default"
          />
        </CustomProvider>
      </Flex>

      <Box className="blocos-group">
        <Box className="bloco-info">
          <Text className="text-info">Total de vendas no mês</Text>
          <HStack>
            <Text className="valor-info">20</Text>
            <Icon as={ArrowUpIcon} w={7} h={7} color="green.500" />
          </HStack>
        </Box>
        <Box className="bloco-info">
          <Text className="text-info">Receita mês atual</Text>
          <HStack>
            <Text className="valor-info">R$ 15.000</Text>
            <Icon as={ArrowUpIcon} w={7} h={7} color="green.500" />
          </HStack>
        </Box>
        <Box className="bloco-info">
          <Text className="text-info">Novos clientes</Text>
          <HStack>
            <Text className="valor-info">50</Text>
            <Icon as={ArrowUpIcon} w={7} h={7} color="green.500" />
          </HStack>
        </Box>
        <Box className="bloco-info">
          <Text className="text-info">Taxa de conversão</Text>
          <HStack>
            <Text className="valor-info">5%</Text>
            <Icon as={ArrowUpIcon} w={7} h={7} color="green.500" />
          </HStack>
        </Box>
      </Box>

      {/* Gráficos lado a lado */}
      <Flex gap={4} wrap="wrap" mt={10}>
        {/* Gráfico de Linhas */}
        <Box
          w={["100%", "49%"]}
          bg="white"
          p={7}
          borderRadius="20px"
          boxShadow="md"
        >
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Vendas por Mês
          </Text>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salesData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="vendas" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        {/* Gráfico de Pizza */}
        <Box
          w={["100%", "49%"]}
          bg="white"
          p={7}
          borderRadius="20px"
          boxShadow="md"
        >
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Porcentagem por Categoria
          </Text>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </Flex>

      <Box className="container-indicadores" mt={10}>
        <VStack align="start" mb={5}>
          <HStack>
            <Icon as={CgPerformance} w={6} h={6} />
            <Text fontSize="xl" fontWeight="bold">
              Indicadores de Desempenho
            </Text>
          </HStack>
          <Text>
            Visualize os principais indicadores de vendas e movimentações.
          </Text>
        </VStack>

        <Flex gap={4} wrap="wrap">
          {/* Gráfico de Barras - Movimentações */}
          <Box
            w={["100%", "32%"]}
            bg="white"
            p={5}
            borderRadius="10px"
            boxShadow="md"
          >
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Movimentações
            </Text>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={movimentacoesData}>
                <XAxis dataKey="categoria" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="valor" fill="#5B93FF" />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          {/* Mapa de Fortaleza - Bairros mais vendidos */}

          <MapaFortaleza />
          {/* Lista de Produtos Mais Vendidos */}
          <Box
            w={["100%", "32%"]}
            bg="white"
            p={5}
            borderRadius="10px"
            boxShadow="md"
          >
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Produtos Mais Vendidos
            </Text>
            <VStack align="start">
              {produtosMaisVendidos.map((produto, index) => (
                <HStack key={index} justify="space-between" w="100%">
                  <Text>{produto.nome}</Text>
                  <Text fontWeight="bold">{produto.quantidade}</Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
