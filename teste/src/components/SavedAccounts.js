// components/SavedAccounts.js
import { useState } from "react";
import { Box, Button, Flex, Text } from "@chakra-ui/react";
import Image from "next/image";
import { FaTrash } from "react-icons/fa";

const SavedAccounts = ({
  savedUser,
  autoLogin,
  deleteUser,
  setShowLoginForm,
}) => {
  return (
    <div>
      <h2 className="title-login">Fazer Login</h2>
      <p className="description-login">Selecione uma de suas contas salvas</p>
      {savedUser.map((user) => (
        <div
          key={user.token}
          onClick={() => autoLogin(user.token)}
          className="flex justify-between cursor-pointer !p-4 !border rounded-lg !mt-4 bg-[#F9FAFB] hover:bg-gray-200 transition"
        >
          <Flex align="center" gap={"3"}>
            <Image
              width={512}
              height={512}
              src="/images-perfil/foto-perfil-anonima.png"
              alt="Foto de perfil"
              className="w-10 h-10 rounded-full mr-2"
            />
            <Text fontSize="lg">
              <span className="text-[#9d9d9d] ml-1">Conta:</span> {user.name}
            </Text>
          </Flex>
          <Button
            className="p-4"
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              deleteUser(user);
            }}
            aria-label="Excluir usuário"
          >
            <FaTrash className="text-red-500" />
          </Button>
        </div>
      ))}

      <Button
        className="!mt-4  !font-normal !text-[16px] w-full botao-teste !text-white !rounded-lg transition"
        onClick={() => setShowLoginForm(true)}
      >
        Fazer login com outra conta
      </Button>
    </div>
  );
};

export default SavedAccounts;
