"use client";
import {
  Box,
  Button,
  Dialog,
  Portal,
  CloseButton,
  HStack,
  Text,
  Badge,
} from "@chakra-ui/react";

import { BsPrinterFill } from "react-icons/bs";
import { IoPeopleSharp } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";
import { BsPersonFillAdd } from "react-icons/bs";

import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { FiRefreshCcw } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { toaster } from "@/components/ui/toaster";
import { MdLabelOutline, MdStore } from "react-icons/md";
import FornecedoresTable from "@/Tabelas/FornecedoresTable";
import FornecedorModal from "@/components/modais/FornecedorModal";
import { FaBoxOpen } from "react-icons/fa";

export default function FornecedoresPage() {
  const documentoRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const fetchDataRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fornecedorEditando, setFornecedorEditando] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm();

  const onSubmit = async (data) => {
    if (!data.limiteCredito || data.limiteCredito === "") {
      data.limiteCredito = 0.0;
    } else {
      data.limiteCredito = parseFloat(data.limiteCredito);
    }

    const payload = {
      ...data,
    };
    const isEditing = !!fornecedorEditando;

    try {
      const response = await fetch(
        `http://localhost:5000/api/fornecedores${
          isEditing ? `/${fornecedorEditando.id}` : ""
        }`,
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok) {
        setTableKey((prev) => prev + 1); // atualiza a tabela
        setIsModalOpen(false);
        resetForm();
        setFornecedorEditando(null);
        toaster.create({
          title: isEditing ? "Fornecedor Atualizado!" : "Fornecedor Novo!",
          description: isEditing
            ? "Alterações salvas com sucesso"
            : "Fornecedor criado com sucesso",
          type: "success",
          duration: 3000,
        });
      } else {
        toaster.create({
          title: "Erro!",
          description: `Erro ao ${
            isEditing ? "atualizar" : "criar"
          } fornecedor: ${result.error}`,
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
    setTimeout(() => {
      setValue("documento", "");
      documentoRef.current = null;
      reset();
    }, 500);
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/fornecedores?limit=1000"
      );

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status}`);
      }

      const json = await response.json();
      return json.data;
    } catch (error) {
      console.error("Erro ao buscar dados:", error.message);
      return [];
    }
  };
  const exportToExcel = async () => {
    setIsExporting(true);
    const data = await fetchData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fornecedores");
    XLSX.writeFile(workbook, "Fornecedores.xlsx");
    setIsExporting(false);
  };
  const [tableKey, setTableKey] = useState(0);

  const preencherFormulario = (fornecedor) => {
    setValue("nome", fornecedor.Nome || "");
    setValue("documento", fornecedor.CNPJ || "");
    setValue("email", fornecedor.Email || "");
    setValue("telefone", fornecedor.Telefone || "");
    setValue("status", fornecedor.Status || "Inativo");
    setValue("inscricaoEstadual", fornecedor["Inscrição Estadual"]);

    setValue("endereco", fornecedor.Endereço || "");
    setValue("complemento", fornecedor.Complemento || "");
    setValue("cidade", fornecedor.Cidade || "");
    setValue("bairro", fornecedor.Bairro || "");
    setValue("cep", fornecedor.CEP || "");

    setValue("referenciaBancaria", fornecedor["Referência Bancária"] || "");
    setValue("nomeTitular", fornecedor["Titular da Conta"] || "");
    setValue("chavePix", fornecedor["Chave Pix"] || "");
    setValue("condicoesPagamento", fornecedor["Condições de Pagamento"] || "");
    setValue("limiteCredito", fornecedor["Crédito"] || "");

    setValue("observacoes", fornecedor["Observações"] || "");
  };

  useEffect(() => {
    if (fornecedorEditando) {
      setIsModalOpen(true);
      preencherFormulario(fornecedorEditando);
      // console.log(fornecedorEditando);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fornecedorEditando]);

  const handleCloseModalComConfirmacao = () => {
    if (isDirty) {
      const confirmacao = window.confirm(
        "Você tem alterações não salvas. Tem certeza que deseja fechar? Os dados serão perdidos."
      );
      if (!confirmacao) return;
    }

    // se não tiver alterações ou usuário confirmou
    setIsModalOpen(false);
    setFornecedorEditando(null);
    resetForm();
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center gap-3 mb-3">
          <MdStore className="!text-[25px]" />
          <p className="title-session !text-[20px]">
            Gerenciamento dos Fornecedores
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
                        Exportar Fornecedores
                      </Dialog.Title>
                    </Box>
                    <Dialog.CloseTrigger asChild>
                      <CloseButton />
                    </Dialog.CloseTrigger>
                  </Dialog.Header>

                  <Dialog.Body pt={4} pb={6} fontSize="sm" color="gray.600">
                    Escolha o formato desejado para exportar os dados da tabela
                    de fornecedores.
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
                    className="!border-b"
                  >
                    <Box className="flex items-center gap-4">
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={3}
                        className="bg-[#f1f1f1] !px-4 !py-2  rounded-[10px] !border !border-[#5e5e5e] shadow-md"
                      >
                        <FaBoxOpen size={25} />

                        <Dialog.Title
                          fontWeight="bold"
                          fontSize="lg"
                          className="!leading-0 "
                        >
                          {fornecedorEditando
                            ? "Informações do Fornecedor"
                            : "Adicionar Novo Fornecedor"}
                        </Dialog.Title>
                      </Box>
                      {fornecedorEditando && (
                        <Badge colorPalette="orange">
                          {" "}
                          <MdLabelOutline />
                          Editando
                        </Badge>
                      )}
                    </Box>
                    <HStack>
                      <CloseButton
                        rounded="10px"
                        variant="subtle"
                        colorPalette="gray"
                        onClick={handleCloseModalComConfirmacao}
                      />
                    </HStack>
                  </Dialog.Header>

                  <Dialog.Body pt={4} pb={6} flex="1" overflowY="auto">
                    <FornecedorModal
                      register={register}
                      control={control}
                      errors={errors}
                      documentoRef={documentoRef}
                      setValue={setValue}
                      fornecedorEditando={fornecedorEditando}
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
                      onClick={handleCloseModalComConfirmacao}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
                      disabled={fornecedorEditando && !isDirty}
                      form="formFornecedor"
                      className="!text-white"
                      rounded="5px"
                      colorPalette="green"
                    >
                      {fornecedorEditando
                        ? isDirty
                          ? "Salvar Alterações"
                          : "Salvar"
                        : "Salvar"}
                    </Button>
                  </Dialog.Footer>
                </Dialog.Content>
              </Dialog.Positioner>
            </Portal>
          </Dialog.Root>
        </div>
      </div>

      <FornecedoresTable
        key={tableKey}
        fetchDataRef={fetchDataRef}
        onFornecedorEditandoChange={setFornecedorEditando}
      />
    </div>
  );
}
