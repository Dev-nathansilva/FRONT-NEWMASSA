import ClientesTable from "@/Tabelas/ClientesTable";
import {
  Box,
  Button,
  Dialog,
  Portal,
  CloseButton,
  HStack,
} from "@chakra-ui/react";

import { BsPrinterFill } from "react-icons/bs";
import { IoPeopleSharp } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";
import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { FiRefreshCcw } from "react-icons/fi";
import { useForm } from "react-hook-form";
import ClienteModal from "@/components/modais/ClienteModal";
import { toaster } from "@/components/ui/toaster";

export default function ClientesPage() {
  const [tipo, setTipo] = useState("");
  const documentoRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const fetchDataRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const payload = {
      ...data,
    };

    try {
      const response = await fetch("http://localhost:5000/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        resetForm();
        setTableKey((prev) => prev + 1); // atualiza a tabela
        setIsModalOpen(false);
        toaster.create({
          title: "Cliente Novo!",
          description: "Cliente Criado com Sucesso",
          type: "success",
          duration: 3000,
        });
      } else {
        toaster.create({
          title: "Erro!",
          description: `Erro ao criar cliente: ${result.error}`,
          type: "warning",
          duration: 3000,
        });
      }
    } catch (error) {
      toaster.create({
        title: "Erro!",
        description: `Erro ao conectar com o servidor: ${error.message}`,
        type: "error",
        duration: 3000,
      });
    }
  };

  const resetForm = () => {
    setTipo("");
    setValue("tipo", "");
    setValue("documento", "");
    documentoRef.current = null;
    reset();
  };

  // Atualiza a máscara do documento quando tipoPessoa muda
  const handleTipoChange = (e) => {
    const valor = e.target.value;
    setTipo(valor);
    setValue("tipo", valor);
    setValue("documento", "");
  };

  const fetchData = async () => {
    const response = await fetch(
      "http://localhost:5000/api/clientes?limit=1000"
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
          <IoPeopleSharp className="!text-[25px]" />
          <p className="title-session !text-[20px]">
            Gerenciamento dos Clientes
          </p>
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
                      className="!text-white !font-bold"
                      isLoading={isExporting}
                      colorPalette="red"
                      variant="solid"
                      borderRadius="md"
                    >
                      Exportar PDF
                    </Button>
                    <Button
                      className="!text-white !font-bold"
                      onClick={exportToExcel}
                      isLoading={isExporting}
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

          <Dialog.Root
            size="cover"
            placement="center"
            motionPreset="scale"
            open={isModalOpen}
            onOpenChange={setIsModalOpen}
          >
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
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      gap={2}
                      className="bg-[#e9e9e9] !px-5 rounded-[10px]"
                    >
                      <LuPlus size={20} />
                      <Dialog.Title fontWeight="bold" fontSize="lg">
                        Adicionar Novo Cliente
                      </Dialog.Title>
                    </Box>
                    <HStack>
                      <CloseButton
                        rounded="10px"
                        variant="subtle"
                        colorPalette="gray"
                        onClick={() => {
                          resetForm();
                          setIsModalOpen(false); // FECHA O MODAL
                        }}
                      />
                    </HStack>
                  </Dialog.Header>

                  <Dialog.Body pt={4} pb={6} flex="1" overflowY="auto">
                    <ClienteModal
                      register={register}
                      control={control}
                      errors={errors}
                      tipo={tipo}
                      handleTipoChange={handleTipoChange}
                      documentoRef={documentoRef}
                      setValue={setValue}
                    />
                  </Dialog.Body>

                  <Dialog.Footer
                    display="flex"
                    justifyContent="flex-end"
                    gap={3}
                  >
                    <Button
                      rounded="5px"
                      variant="surface"
                      onClick={() => {
                        resetForm();
                        setIsModalOpen(false); // FECHA O MODAL
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
                      form="formCliente"
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

      <ClientesTable key={tableKey} fetchDataRef={fetchDataRef} />
    </div>
  );
}
