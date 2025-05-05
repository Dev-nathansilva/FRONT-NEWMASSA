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

import {
  BsFillPersonBadgeFill,
  BsPersonBoundingBox,
  BsPrinterFill,
} from "react-icons/bs";
import { IoPeopleSharp } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";
import { BsPersonFillAdd } from "react-icons/bs";

import { useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { FiRefreshCcw } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { toaster } from "@/components/ui/toaster";
import { MdLabelOutline } from "react-icons/md";
import UsuariosTable from "@/Tabelas/UsuariosTable";
import UsuarioModal from "@/components/modais/UsuarioModal";
import { FaUserTie } from "react-icons/fa6";

export default function UsuariosPage() {
  const [cargo, setCargo] = useState("");
  const documentoRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);
  const fetchDataRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

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
    const formData = new FormData();

    for (const key in data) {
      if (key === "fotoPerfil") {
        if (data[key] instanceof File) {
          formData.append("fotoPerfil", data[key]);
        } else {
          formData.append("fotoPerfil", ""); // avisa que a imagem foi removida
        }
      } else {
        formData.append(key, data[key]);
      }
    }

    const isEditing = !!usuarioEditando;

    try {
      const response = await fetch(
        `http://localhost:5000/api/usuarios${
          isEditing ? `/${usuarioEditando.id}` : ""
        }`,
        {
          method: isEditing ? "PUT" : "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok) {
        setTableKey((prev) => prev + 1); // atualiza a tabela
        setIsModalOpen(false);
        resetForm();
        setUsuarioEditando(null);
        toaster.create({
          title: isEditing ? "Usuário Atualizado!" : "Usuário Novo!",
          description: isEditing
            ? "Alterações salvas com sucesso"
            : "Usuário criado com sucesso",
          type: "success",
          duration: 2000,
        });
      } else {
        toaster.create({
          title: "Erro!",
          description: `Erro ao ${isEditing ? "atualizar" : "criar"} usuário: ${
            result.error
          }`,
          type: "warning",
          duration: 2000,
        });
      }
    } catch (error) {
      toaster.create({
        title: "Erro!",
        description: `Erro ao conectar com o servidor: ${error.message}`,
        type: "error",
        duration: 2000,
      });
    }
  };

  const resetForm = () => {
    setTimeout(() => {
      // setCargo("");
      setValue("nivel", "");
      // documentoRef.current = null;
      // handleCargoChange({ target: { value: "" } });
      reset();
    }, 500);
  };

  // // Atualiza a máscara do documento quando cargoPessoa muda
  // const handleCargoChange = (e) => {
  //   const valor = e.target.value;
  //   // setCargo(valor);
  //   setValue("cargo", valor);
  //   setValue("documento", "");
  // };

  const fetchData = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/usuarios?limit=1000"
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
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");
    XLSX.writeFile(workbook, "usuarios.xlsx");
    setIsExporting(false);
  };
  const [tableKey, setTableKey] = useState(0);

  const preencherFormulario = (usuario) => {
    setValue("id", usuario.id || "");
    setValue("name", usuario.Nome || "");
    setValue("nivel", usuario.Nivel || "Padrão");
    setValue("email", usuario.Email || "");
    setValue("telefone", usuario.Telefone || "");
    setValue("password", usuario.Senha || "");
    setValue("fotoPerfil", usuario.FotoPerfil || "");
  };

  useEffect(() => {
    if (usuarioEditando) {
      setIsModalOpen(true);
      preencherFormulario(usuarioEditando);
      console.log("usuarioEditando", usuarioEditando);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [usuarioEditando]);

  const handleCloseModalComConfirmacao = () => {
    if (isDirty) {
      const confirmacao = window.confirm(
        "Você tem alterações não salvas. Tem certeza que deseja fechar? Os dados serão perdidos."
      );
      if (!confirmacao) return;
    }

    // se não tiver alterações ou usuário confirmou
    setIsModalOpen(false);
    setUsuarioEditando(null);
    resetForm();
  };

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-center gap-3 mb-3">
          <BsFillPersonBadgeFill className="!text-[25px]" />
          <p className="title-session !text-[20px]">Usuários do Sistema</p>
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
                        <FaUserTie size={25} />
                        <Dialog.Title
                          fontWeight="bold"
                          fontSize="lg"
                          className="!leading-0 "
                        >
                          {usuarioEditando
                            ? "Informações do Usuário"
                            : "Adicionar Novo Usuário"}
                        </Dialog.Title>
                      </Box>
                      {usuarioEditando && (
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
                    <UsuarioModal
                      register={register}
                      control={control}
                      errors={errors}
                      documentoRef={documentoRef}
                      setValue={setValue}
                      isEditando={!!usuarioEditando}
                      watch={watch}
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
                      disabled={usuarioEditando && !isDirty}
                      form="formUsuario"
                      className="!text-white"
                      rounded="5px"
                      colorPalette="green"
                    >
                      {usuarioEditando
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

      <UsuariosTable
        key={tableKey}
        fetchDataRef={fetchDataRef}
        onUsuarioEditandoChange={setUsuarioEditando}
      />
    </div>
  );
}
