"use client";

import { useState } from "react";
import { Box, Text, VStack, Image, Flex, Button } from "@chakra-ui/react";
import {
  FiUsers,
  FiShoppingCart,
  FiFileText,
  FiClipboard,
} from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";

import { BiSolidDashboard, BiSolidReport, BiSolidUser } from "react-icons/bi";
import LogoutButton from "../LogoutButton";
import { MdCallEnd } from "react-icons/md";
import { Portal } from "@chakra-ui/react";

const menuItems = [
  { name: "Dashboard", icon: <BiSolidDashboard /> },
  {
    name: "Cadastros",
    icon: <FiUsers />,
    submenu: [
      "Clientes",
      "Fornecedores",
      "Produtos",
      "Vendedores",
      "Funcionários",
    ],
  },
  {
    name: "Vendas",
    icon: <FiShoppingCart />,
    submenu: ["Tela de Vendas", "Extrato", "Comissões"],
  },
  {
    name: "Controle",
    icon: <FiClipboard />,
    submenu: ["Estoque", "Financeiro / Transações", "Rotas", "Contas"],
  },
  {
    name: "Emissões",
    icon: <FiFileText />,
    submenu: ["Boleto", "Nota Fiscal", "Duplicata", "Cheque"],
  },
  { name: "CRM", icon: <FiUsers /> },
  { name: "Relatórios", icon: <BiSolidReport /> },
  { name: "Usuários", icon: <BiSolidUser /> },
];

const hasPermission = (permissions, menu, submenu = null) => {
  if (permissions.includes(menu)) return true;
  if (submenu) {
    return permissions.includes(`${menu}.${submenu}`);
  }
  return permissions.some((perm) => perm.startsWith(`${menu}.`));
};

export default function Sidebar({
  isOpen,
  toggle,
  setActivePage,
  permissions,
}) {
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [submenuPosition, setSubmenuPosition] = useState({ top: 0, left: 0 });

  return (
    <Box
      width={isOpen ? "210px" : "100px"}
      transition="width 0.3s"
      className="sidebar-container overflow-auto"
    >
      <Box>
        <Box mb={6} textAlign="center">
          <Image
            src={isOpen ? "/logos/completa.png" : "/logos/icone.png"}
            alt="Logo"
            height={isOpen ? "50px" : "40px"}
            mx="auto"
            transition="width 0.3s"
          />
        </Box>

        <VStack align="stretch" className="group-menus">
          {menuItems.map((item) => {
            if (!hasPermission(permissions, item.name)) return null;
            return (
              <Box
                key={item.name}
                position="relative"
                onMouseEnter={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  setSubmenuPosition({
                    top: rect.top,
                    left: isOpen ? 195 : 85,
                  });
                  setHoveredMenu(item.name);
                }}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <Box display="flex" flexDirection="column" position="relative">
                  <Box
                    className="item-menu"
                    bg={hoveredMenu === item.name ? "#154AA1" : "transparent"}
                    onClick={() =>
                      !item.submenu?.length &&
                      setActivePage({ main: item.name, sub: "" })
                    }
                    justifyContent={isOpen ? "space-between" : "center"}
                    px={3}
                    py={2}
                    cursor="pointer"
                  >
                    <Flex align="center">
                      <Box className="icon-sidebar">{item.icon}</Box>
                      {isOpen && (
                        <Text
                          ml={3}
                          color={hoveredMenu === item.name ? "white" : "black"}
                        >
                          {item.name}
                        </Text>
                      )}
                    </Flex>

                    {/* Adiciona a seta se houver submenu */}
                    {isOpen && item.submenu && (
                      <IoIosArrowForward
                        size={16}
                        color={
                          hoveredMenu === item.name
                            ? "white"
                            : "rgb(193 193 193)"
                        }
                      />
                    )}
                  </Box>

                  {/* Submenu */}
                  {item.submenu && hoveredMenu === item.name && (
                    <Portal>
                      <Box
                        position="fixed"
                        top={submenuPosition.top}
                        left={submenuPosition.left - 2}
                        zIndex={1000}
                        onMouseEnter={() => setHoveredMenu(item.name)}
                        onMouseLeave={() => setHoveredMenu(item.name)}
                      >
                        <Box pl="3">
                          {" "}
                          {/* Box extra invisível para garantir espaço no hover */}
                          <Box
                            bg="white"
                            border="1px solid"
                            borderColor="gray.300"
                            borderRadius="md"
                            minWidth="250px"
                            className="submenu-container"
                          >
                            <Box
                              className="title-submenu"
                              display="flex"
                              alignItems="center"
                              p={2}
                            >
                              <Box mr={2}>{item.icon}</Box>
                              <Text>{item.name}</Text>
                            </Box>

                            {item.submenu.map((sub) => {
                              if (!hasPermission(permissions, item.name, sub))
                                return null;
                              return (
                                <Box
                                  key={sub}
                                  p={2}
                                  className="submenu-item"
                                  borderRadius="md"
                                  cursor="pointer"
                                  _hover={{ bg: "rgba(0,0,0,0.04)" }}
                                  onClick={() =>
                                    setActivePage({ main: item.name, sub })
                                  }
                                >
                                  {sub}
                                </Box>
                              );
                            })}
                          </Box>
                        </Box>
                      </Box>
                    </Portal>
                  )}
                </Box>
              </Box>
            );
          })}
        </VStack>
      </Box>

      <Flex className="group-buttons-sidebar" direction="column" gap="3">
        <Button
          color="black"
          border="1px solid gray.300"
          _hover={{ bg: "gray.300" }}
          textAlign="left"
          className={`flex ${
            isOpen ? "!justify-start" : "!justify-center"
          } button-padrao-sidebar`}
        >
          <Box className="icon-sidebar">
            {" "}
            <MdCallEnd size={20} />
          </Box>

          {isOpen && <Text>Suporte</Text>}
        </Button>

        <LogoutButton isOpen={isOpen} />
      </Flex>
    </Box>
  );
}
