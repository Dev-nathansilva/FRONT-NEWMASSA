"use client";

import { useState } from "react";
import { Toaster, toaster } from "@/components/ui/toaster";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import { RiLogoutBoxRFill } from "react-icons/ri";
import Spinner from "@/components/Spinner"; // Importando seu Spinner

export default function LogoutButton({ isOpen }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true); // Ativa o Spinner

    try {
      const res = await fetch("/api/logout", { method: "POST" });

      if (res.ok) {
        toaster.create({
          description: "Logout realizado com sucesso!",
          type: "success",
          duration: 1300,
        });

        sessionStorage.clear();

        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      } else {
        throw new Error("Erro ao fazer logout");
      }
    } catch (error) {
      console.error(error);
      toaster.create({
        title: "Erro ao fazer logout",
        type: "error",
      });
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    }
  };

  return (
    <>
      <Button
        onClick={handleLogout}
        _hover={{ bg: "gray.300" }}
        className={`flex ${
          isOpen ? "!justify-start" : "!justify-center"
        } button-padrao-sidebar`}
        isDisabled={isLoading} // Desativa o botão enquanto carrega
      >
        <Box className="icon-sidebar">
          {isLoading ? (
            <Spinner size={20} color="red" /> // Mostra o Spinner enquanto carrega
          ) : (
            <RiLogoutBoxRFill size={20} color="red" /> // Ícone normal
          )}
        </Box>
        {isOpen && <Text>{isLoading ? "Saindo..." : "Sair"}</Text>}
      </Button>
      <Toaster />
    </>
  );
}
