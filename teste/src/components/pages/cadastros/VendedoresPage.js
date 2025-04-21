import ClientesTable from "@/Tabelas/ClientesTable";
import { Box, Button, Dialog, Portal, CloseButton } from "@chakra-ui/react";
import { BsPrinterFill } from "react-icons/bs";
import { IoPeopleSharp } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";
import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { FiRefreshCcw } from "react-icons/fi";
import { MdBusinessCenter } from "react-icons/md";
import VendedoresTable from "@/Tabelas/VendedoresTable";

export default function VendedoresPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const fetchDataRef = useRef(null);

  const fetchData = async () => {
    const response = await fetch(
      "http://localhost:5000/api/vendedores?limit=1000"
    );
    const json = await response.json();
    return json.data;
  };
  const exportToExcel = async () => {
    setIsExporting(true);
    const data = await fetchData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");
    XLSX.writeFile(workbook, "clientes.xlsx");
    setIsExporting(false);
  };
  const [tableKey, setTableKey] = useState(0);

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center gap-3 mb-3">
          <MdBusinessCenter className="text-[25px]" />
          <p className="title-session text-[20px]">Vendedores</p>
          <button
            onClick={() => setTableKey((prev) => prev + 1)}
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-500 px-2 py-2 rounded-md font-medium border "
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
                        Exportar Clientes
                      </Dialog.Title>
                    </Box>
                    <Dialog.CloseTrigger asChild>
                      <CloseButton />
                    </Dialog.CloseTrigger>
                  </Dialog.Header>

                  <Dialog.Body pt={4} pb={6} fontSize="sm" color="gray.600">
                    Escolha o formato desejado para exportar os dados da tabela
                    de clientes.
                  </Dialog.Body>

                  <Dialog.Footer
                    display="flex"
                    justifyContent="flex-end"
                    gap={3}
                  >
                    <Button
                      isLoading={isExporting}
                      colorScheme="red"
                      variant="solid"
                      borderRadius="md"
                    >
                      Exportar PDF
                    </Button>
                    <Button
                      onClick={exportToExcel}
                      isLoading={isExporting}
                      colorScheme="green"
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

          <Button
            className="bg-blue-600 text-white px-4 rounded-md"
            variant="solid"
            onClick={() => setModalAberto(true)}
          >
            <LuPlus /> Adicionar Novo
          </Button>
        </div>
      </div>

      <VendedoresTable key={tableKey} fetchDataRef={fetchDataRef} />

      {/* <ClienteModal
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onClienteCriado={() => {
          if (fetchDataRef.current) {
            fetchDataRef.current();
          }
        }}
      /> */}
    </div>
  );
}
