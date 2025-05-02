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
import { format } from "date-fns";
import { BsPrinterFill } from "react-icons/bs";
import { IoPeopleSharp } from "react-icons/io5";
import { LuPackageCheck, LuPlus } from "react-icons/lu";
import { BsPersonFillAdd } from "react-icons/bs";

import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { FiRefreshCcw } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { toaster } from "@/components/ui/toaster";
import { MdLabelOutline } from "react-icons/md";
import ProdutoModal from "@/components/modais/ProdutoModal";
import ProdutosTable from "@/Tabelas/ProdutoTable";
import { FaBoxes } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa6";

export default function ProdutosPage() {
  const [tipo, setTipo] = useState("");
  const documentoRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const fetchDataRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    watch,
    formState: { errors, isDirty },
  } = useForm();

  const onSubmit = async (data) => {
    console.log("onsubmit", data);
    data.estoque = parseInt(data.estoque) || 0.0;
    data.precoCusto = parseFloat(data.precoCusto) || 0.0;
    data.precoVenda = parseFloat(data.precoVenda) || 0.0;
    data.margemLucro = parseFloat(data.margemLucro) || 0.0;
    data.icmsInterno = parseFloat(data.icmsInterno) || 0.0;
    data.baseCalculo = parseFloat(data.baseCalculo) || 0.0;
    data.ipi = parseFloat(data.ipi) || 0.0;
    data.pesoBruto = parseFloat(data.pesoBruto) || 0.0;
    data.pesoLiquido = parseFloat(data.pesoLiquido) || 0.0;

    if (!data.dataValidade) {
      data.dataValidade = null;
    }

    const composicoesFormatadas = data.composicoes?.map((item) => ({
      componenteId: item.componente.id,
      quantidade: parseFloat(item.quantidade) || 0,
    }));

    const fornecedoresFormatados = data.fornecedores?.map((item) => ({
      fornecedorId: item.fornecedor.id,
    }));

    const payload = {
      ...data,
      composicoes: composicoesFormatadas,
      fornecedores: fornecedoresFormatados,
    };
    const isEditing = !!produtoEditando;

    try {
      const response = await fetch(
        `http://localhost:5000/api/produtos${
          isEditing ? `/${produtoEditando.id}` : ""
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
        setProdutoEditando(null);
        toaster.create({
          title: isEditing ? "Produto Atualizado!" : "Produto Novo!",
          description: isEditing
            ? "Alterações salvas com sucesso"
            : "Produto criado com sucesso",
          type: "success",
          duration: 3000,
        });
      } else {
        toaster.create({
          title: "Erro!",
          description: `Erro ao ${isEditing ? "atualizar" : "criar"} produto: ${
            result.error
          }`,
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
      setTipo("");
      setValue("tipo", "");
      setValue("documento", "");
      documentoRef.current = null;
      handleTipoChange({ target: { value: "" } });
      reset();
    }, 500);
  };

  // Atualiza a máscara do documento quando tipoPessoa muda
  const handleTipoChange = (e) => {
    const valor = e.target.value;
    setTipo(valor);
    setValue("tipo", valor);
    setValue("documento", "");
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/produtos?limit=1000"
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Produtos");
    XLSX.writeFile(workbook, "produtos.xlsx");
    setIsExporting(false);
  };
  const [tableKey, setTableKey] = useState(0);

  const preencherFormulario = (produto) => {
    setValue("id", produto.id || "");
    setValue("descricao", produto["Descrição"] || "");
    setValue("unidade", produto.Unidade || "Un");
    setValue("formato", produto.Formato || "Produto Final");
    setValue("codigoSKU", produto["Código (SKU)"] || "");
    setValue("estoque", produto.Estoque || "");
    setValue("precoCusto", produto["Preço de Custo"] || "");
    setValue("precoVenda", produto["Preço de Venda"] || "");
    setValue("margemLucro", produto["Margem de Lucro"] || "");
    setValue("codigoBarrasGTIN", produto["Código GTIN"]);
    setValue("status", produto.Status ?? false);
    setValue("observacoes", produto["Observações"] || "");
    setValue("dataValidade", produto["Data de Validade"] || "");

    setValue("origem", produto.Origem || "0");
    setValue("ncm", produto.NCM || "");
    setValue("cest", produto.CEST || "");
    setValue("csosn", produto.CSOSN || "");
    setValue("icmsInterno", produto["ICMS Interno"] || "");
    setValue("baseCalculo", produto["Base de Calculo"] || "");
    setValue("ipi", produto.IPI || "");
    setValue("cstPis", produto["CST PIS"] || "");
    setValue("cstCofins", produto["CST COFINS"] || "");
    setValue("pesoBruto", produto["Peso Liquido"] || "");
    setValue("pesoLiquido", produto["CST PIS"] || "");
    setValue("composicoes", produto["Composições"]);
    setValue("fornecedores", produto["Fornecedores"]);
  };

  useEffect(() => {
    if (produtoEditando) {
      setIsModalOpen(true);
      preencherFormulario(produtoEditando);
      console.log("produtoEditando", produtoEditando);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [produtoEditando]);

  const handleCloseModalComConfirmacao = () => {
    if (isDirty) {
      const confirmacao = window.confirm(
        "Você tem alterações não salvas. Tem certeza que deseja fechar? Os dados serão perdidos."
      );
      if (!confirmacao) return;
    }

    // se não tiver alterações ou usuário confirmou
    setIsModalOpen(false);
    setProdutoEditando(null);
    resetForm();
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center gap-3 mb-3">
          <LuPackageCheck className="!text-[25px]" />
          <p className="title-session !text-[20px]">Produtos</p>
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
                        Exportar Produtos
                      </Dialog.Title>
                    </Box>
                    <Dialog.CloseTrigger asChild>
                      <CloseButton />
                    </Dialog.CloseTrigger>
                  </Dialog.Header>

                  <Dialog.Body pt={4} pb={6} fontSize="sm" color="gray.600">
                    Escolha o formato desejado para exportar os dados da tabela
                    de produtos.
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
                        <LuPackageCheck size={25} />
                        <Dialog.Title
                          fontWeight="bold"
                          fontSize="lg"
                          className="!leading-0 "
                        >
                          {produtoEditando
                            ? "Informações do Produto"
                            : "Adicionar Novo Produto"}
                        </Dialog.Title>
                      </Box>
                      {produtoEditando && (
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

                  <Dialog.Body
                    pt={4}
                    pb={6}
                    flex="1"
                    overflowY="auto"
                    id="modal-body"
                  >
                    <ProdutoModal
                      register={register}
                      control={control}
                      errors={errors}
                      tipo={tipo}
                      watch={watch}
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
                      onClick={handleCloseModalComConfirmacao}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      onClick={handleSubmit(onSubmit)}
                      disabled={produtoEditando && !isDirty}
                      form="formProduto"
                      className="!text-white"
                      rounded="5px"
                      colorPalette="green"
                    >
                      {produtoEditando
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

      <ProdutosTable
        key={tableKey}
        fetchDataRef={fetchDataRef}
        onProdutoEditandoChange={setProdutoEditando}
      />
    </div>
  );
}
