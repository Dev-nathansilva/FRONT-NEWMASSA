"use client";

import {
  Box,
  Circle,
  Flex,
  Float,
  Image,
  Input,
  Kbd,
  Text,
} from "@chakra-ui/react";
import { FiBell } from "react-icons/fi";
import { PiSidebarLight } from "react-icons/pi";
import { RxGear } from "react-icons/rx";
import { InputGroup } from "../ui/input-group";
import { LuSearch } from "react-icons/lu";

export default function Topbar({
  user,
  toggleSidebar,
  toggleRightPanel,
  mainTitle,
  subTitle,
}) {
  const profileImage = user?.foto || "../images-perfil/foto-perfil-anonima.png";

  return (
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
          <Image
            src={profileImage}
            alt="Foto de perfil"
            className="w-10 h-10 rounded-full"
          />
          <Box>
            <Text className="!font-bold text-black">
              {user?.name || "Usuário"}
            </Text>
            <Text className="!text-gray-500 text-sm !m-0">
              {user?.nivel || "Sem nível"}
            </Text>
          </Box>
        </Box>
      </Box>
    </Flex>
  );
}
