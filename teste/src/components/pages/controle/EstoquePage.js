import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  HStack,
  Icon,
  IconButton,
  Text,
  VStack,
  Badge,
  Checkbox,
  Table,
  Dialog,
  Portal,
} from "@chakra-ui/react";
import {
  FaBoxes,
  FaPrint,
  FaShoppingCart,
  FaClipboardList,
  FaFileInvoiceDollar,
  FaTrash,
  FaUserTie,
} from "react-icons/fa";
import { FiPlus, FiRefreshCcw } from "react-icons/fi";
import { MdLabelOutline, MdOutlineCleaningServices } from "react-icons/md";
import { BiArrowFromBottom, BiArrowFromTop } from "react-icons/bi";
import { BsPrinterFill } from "react-icons/bs";
import { CloseButton } from "@/components/ui/close-button";
import { LuPlus } from "react-icons/lu";

export default function EstoquePage() {
  return (
    <Box>
      {/* Cabeçalho */}

      <div className="flex justify-between !mb-3">
        <div className="flex items-center gap-3 mb-3">
          <FaBoxes className="!text-[25px]" />
          <p className="title-session !text-[20px]">Estoque</p>
          <button
            onClick={() => setTableKey((prev) => prev + 1)}
            className="flex items-center !gap-2 !bg-gray-100 hover:!bg-gray-200 !text-gray-500 !p-2 !rounded-md !font-medium !border "
          >
            <FiRefreshCcw className=" text-[15px]" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* BOTÃO DE EXPORTAR */}
          <Dialog.Root>
            <Dialog.Trigger asChild>
              <Box className="container-icon-action" cursor="pointer">
                <Box className="icon">
                  <BsPrinterFill color="black" />
                </Box>
              </Box>
            </Dialog.Trigger>

            <Portal>
              <Dialog.Backdrop bg="blackAlpha.400" backdropFilter="blur(2px)" />

              <Dialog.Positioner>
                <Dialog.Content
                  bg="white"
                  borderRadius="xl"
                  boxShadow="lg"
                  p={6}
                  minW={{ base: "90%", md: "400px" }}
                >
                  <Dialog.Header
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box display="flex" alignItems="center" gap={2}>
                      <BsPrinterFill size={18} />
                      <Dialog.Title fontWeight="bold" fontSize="lg">
                        Exportar Usuários
                      </Dialog.Title>
                    </Box>
                    <Dialog.CloseTrigger asChild>
                      <CloseButton />
                    </Dialog.CloseTrigger>
                  </Dialog.Header>

                  <Dialog.Body pt={4} pb={6} fontSize="sm" color="gray.600">
                    Escolha o formato desejado para exportar os dados da tabela
                    de usuários.
                  </Dialog.Body>

                  <Dialog.Footer
                    display="flex"
                    justifyContent="flex-end"
                    gap={3}
                  >
                    <Button
                      className="!text-white !font-bold"
                      colorPalette="red"
                      variant="solid"
                      borderRadius="md"
                    >
                      Exportar PDF
                    </Button>
                    <Button
                      className="!text-white !font-bold"
                      colorPalette="green"
                      variant="solid"
                      borderRadius="md"
                    >
                      Exportar Excel
                    </Button>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>

          <Dialog.Root size="cover" placement="center" motionPreset="scale">
            <Button
              className="!bg-blue-600 hover:!bg-blue-700 !text-white !px-4 !rounded-md"
              variant="solid"
              onClick={() => setIsModalOpen(true)}
            >
              <LuPlus /> Adicionar Novo
            </Button>

            <Portal>
              <Dialog.Backdrop />
              <Dialog.Positioner>
                <Dialog.Content
                  size="cover"
                  bg="white"
                  borderRadius="xl"
                  boxShadow="lg"
                  display="flex"
                  flexDirection="column"
                >
                  <Dialog.Header
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    className="!border-b"
                  >
                    <Box className="flex items-center gap-4">
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={3}
                        className="bg-[#f1f1f1] !px-4 !py-2  rounded-[10px] !border !border-[#5e5e5e] shadow-md"
                      >
                        <FaUserTie size={25} />
                        <Dialog.Title
                          fontWeight="bold"
                          fontSize="lg"
                          className="!leading-0 "
                        >
                          Informações do Usuário
                        </Dialog.Title>
                      </Box>

                      <Badge colorPalette="orange">
                        {" "}
                        <MdLabelOutline />
                        Editando
                      </Badge>
                    </Box>
                    <HStack>
                      <CloseButton
                        rounded="10px"
                        variant="subtle"
                        colorPalette="gray"
                      />
                    </HStack>
                  </Dialog.Header>

                  <Dialog.Body
                    pt={4}
                    pb={6}
                    flex="1"
                    overflowY="auto"
                  ></Dialog.Body>

                  <Dialog.Footer
                    display="flex"
                    justifyContent="flex-end"
                    gap={3}
                  >
                    <Button rounded="5px" variant="surface">
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      form="formUsuario"
                      className="!text-white"
                      rounded="5px"
                      colorPalette="green"
                    >
                      Salvar
                    </Button>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </div>
      </div>

      {/* Produto + Dados Gerais */}
      <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={6}>
        <Box bg="gray.50" p={4} borderRadius="md">
          <Text fontSize="sm" color="gray.600" mb={2}>
            ⚠️ Clique abaixo para selecionar um produto
          </Text>
          <Grid templateColumns="1fr 1fr" gap={4}>
            <Box
              bg="white"
              borderRadius="md"
              p={4}
              textAlign="center"
              boxShadow="sm"
            >
              <Icon as={FaBoxes} boxSize={6} color="gray.500" mb={2} />
              <Text fontWeight="semibold">Produto</Text>
              <Text color="gray.400">---</Text>
            </Box>
            <Box
              bg="white"
              borderRadius="md"
              p={4}
              textAlign="center"
              boxShadow="sm"
            >
              <Text fontWeight="semibold">Qtd. Atual</Text>
              <Text color="gray.400">---</Text>
            </Box>
          </Grid>
          <Button
            mt={2}
            size="sm"
            variant="link"
            colorPalette="gray"
            leftIcon={<MdOutlineCleaningServices />}
          >
            Limpar Campos
          </Button>
        </Box>

        <Grid
          templateColumns="repeat(3, 1fr)"
          gap={4}
          className="!items-center"
        >
          <Box
            bg="white"
            p={4}
            borderRadius="md"
            textAlign="center"
            boxShadow="sm"
          >
            <Text fontWeight="semibold">Entradas</Text>
            <Text>
              + 0 <Icon as={BiArrowFromBottom} />
            </Text>
          </Box>
          <Box
            bg="white"
            p={4}
            borderRadius="md"
            textAlign="center"
            boxShadow="sm"
          >
            <Text fontWeight="semibold">Saídas</Text>
            <Text>
              - 0 <Icon as={BiArrowFromTop} />
            </Text>
          </Box>
          <Box
            bg="white"
            p={4}
            borderRadius="md"
            textAlign="center"
            boxShadow="sm"
          >
            <Text fontWeight="semibold">Saldo</Text>
            <Text>0</Text>
          </Box>
        </Grid>
      </Grid>

      {/* Filtros de Movimentações */}
      <HStack gap={3} mb={4}>
        <Text fontWeight="semibold">Movimentações</Text>
        <Badge colorPalette="red" className="!px-4 !py-3 !rounded-2xl">
          <HStack spacing={1}>
            <Icon as={FaShoppingCart} />
            <Text>Vendas</Text>
          </HStack>
        </Badge>
        <Badge colorPalette="green" className="!px-4 !py-3 !rounded-2xl">
          <HStack spacing={1}>
            <Icon as={FaClipboardList} />
            <Text>Pedido de Compra</Text>
          </HStack>
        </Badge>
        <Badge colorPalette="blue" className="!px-4 !py-3 !rounded-2xl">
          <HStack spacing={1}>
            <Icon as={FaFileInvoiceDollar} />
            <Text>Lançamentos</Text>
          </HStack>
        </Badge>
        <Button size="sm" variant="surface" className="!rounded-2xl">
          Todos
        </Button>
      </HStack>

      {/* Tabela nova com Table.Root */}
      <Box overflowX="auto" borderRadius="md" bg="white" boxShadow="sm">
        <Table.Root size="sm">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader />
              <Table.ColumnHeader className="!p-2">Data</Table.ColumnHeader>
              <Table.ColumnHeader className="!p-2">Entrada</Table.ColumnHeader>
              <Table.ColumnHeader className="!p-2">Saída</Table.ColumnHeader>
              <Table.ColumnHeader className="!p-2">
                Preço de Venda
              </Table.ColumnHeader>
              <Table.ColumnHeader className="!p-2">
                Preço de Compra
              </Table.ColumnHeader>
              <Table.ColumnHeader className="!p-2">Custo</Table.ColumnHeader>
              <Table.ColumnHeader className="!p-2">
                Observações
              </Table.ColumnHeader>
              <Table.ColumnHeader textAlign="end" />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell className="!p-2"></Table.Cell>
              <Table.Cell className="!p-2">-</Table.Cell>
              <Table.Cell className="!p-2">-</Table.Cell>
              <Table.Cell className="!p-2">-</Table.Cell>
              <Table.Cell className="!p-2">-</Table.Cell>
              <Table.Cell className="!p-2">-</Table.Cell>
              <Table.Cell className="!p-2">-</Table.Cell>
              <Table.Cell className="!p-2">-</Table.Cell>
              <Table.Cell textAlign="end">
                <IconButton
                  icon={<FaTrash />}
                  aria-label="Deletar"
                  size="sm"
                  variant="ghost"
                />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
          <Table.Footer>
            <Table.Row>
              <Table.Cell colSpan={9}>
                <Flex
                  justify="space-between"
                  align="center"
                  fontSize="sm"
                  color="gray.500"
                >
                  <Text>0 de 0</Text>
                  <HStack>
                    <Button size="xs" variant="ghost">
                      ←
                    </Button>
                    <Button size="xs" variant="ghost">
                      →
                    </Button>
                  </HStack>
                </Flex>
              </Table.Cell>
            </Table.Row>
          </Table.Footer>
        </Table.Root>
      </Box>
    </Box>
  );
}
