"use client";

import {
  Box,
  Circle,
  Flex,
  Float,
  Image,
  Input,
  Text,
  Button,
  Dialog,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiBell } from "react-icons/fi";
import { PiSidebarLight } from "react-icons/pi";
import { RxGear } from "react-icons/rx";
import { LuSearch } from "react-icons/lu";
import { MdBackup } from "react-icons/md";
import { toaster } from "../ui/toaster";
import { useEffect } from "react";

export default function Topbar({
  user,
  toggleSidebar,
  toggleRightPanel,
  mainTitle,
  subTitle,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const profileImage = user?.foto
    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${user.foto}`
    : "/images-perfil/foto-perfil-anonima.png";

  const handleBackup = async () => {
    if (senha !== "dev") {
      toaster.create({
        description: "Senha incorreta!",
        type: "error",
        duration: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/backup`
      );
      if (!response.ok) throw new Error("Erro ao fazer o backup");

      toaster.create({
        description: "Backup Feito com Sucesso!!",
        type: "success",
        duration: 3000,
      });
      setIsOpen(false);
      setSenha("");
    } catch (error) {
      toaster.create({
        description: "Erro ao fazer o backup!",
        type: "error",
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Flex
        className="topbar-container"
        bg="#F5F5F6"
        color="white"
        alignItems="center"
        justifyContent="space-between"
      >
        <Flex alignItems="center">
          <PiSidebarLight
            onClick={toggleSidebar}
            color="black"
            className=" icone-open-close"
          />
          <Box className="container-title-session">
            <Text className="title-page">{mainTitle}</Text>
            {subTitle && (
              <Box className="submenu-group">
                <span className="text-gray-300">/</span>
                <Text className="subtitle-page"> {subTitle}</Text>
              </Box>
            )}
          </Box>
        </Flex>

        <Box className="flex items-center">
          <Box className="group-actions">
            <Box className="icon-action-topbar" onClick={() => setIsOpen(true)}>
              <MdBackup color="black" />
            </Box>

            <Box className="icon-action-topbar">
              <LuSearch color="black" />
            </Box>

            <Box className="icon-action-topbar" onClick={toggleRightPanel}>
              <FiBell bg="transparent" color="black" />
              <Float offsetY="2" offsetX={2}>
                <Circle
                  className="flex items-center justify-center !text-[13px]"
                  size="6"
                  bg="black"
                  color="white"
                >
                  <span className="!mt-[1px]">0</span>
                </Circle>
              </Float>
            </Box>
            <Box className="icon-action-topbar">
              <RxGear color="black" />
            </Box>
          </Box>
          <Box className="container-perfil ">
            <Box>
              <Image
                id="foto-perfil-user"
                src={profileImage}
                alt="Foto de perfil"
                boxSize="50px"
                borderRadius="full"
                fit="fill"
              />
            </Box>
            <Box>
              <Text id="nome-user" className="!font-bold text-black">
                {user?.name || "Usuário"}
              </Text>
              <Text id="nivel-user" className="!text-gray-500 text-sm !m-0">
                {user?.nivel || "Sem nível"}
              </Text>
              <Text className="id-user hidden">{user?.userId || "-"}</Text>
            </Box>
          </Box>
        </Box>
      </Flex>

      {/* Modal de confirmação com senha */}
      <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.CloseTrigger />
            <Dialog.Header>
              <Dialog.Title className="flex items-center gap-3 !text-2xl">
                <MdBackup /> Backup do Sistema
              </Dialog.Title>
            </Dialog.Header>
            <Dialog.Body className="flex flex-col gap-4">
              <Text>Digite a senha para fazer o backup:</Text>
              <Input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </Dialog.Body>
            <Dialog.Footer className="flex justify-end gap-2 ">
              <Button
                className="!rounded-[10px]"
                variant="ghost"
                onClick={() => setIsOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                className="!bg-gray-300 hover:!bg-gray-200 !rounded-[10px]"
                isLoading={loading}
                onClick={handleBackup}
              >
                Confirmar
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </>
  );
}
