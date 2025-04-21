"use client";

import { Box, IconButton } from "@chakra-ui/react";
import { FiX } from "react-icons/fi";
import { FiXOctagon } from "react-icons/fi";

export default function RightPanel({ onClose }) {
  return (
    <Box
      width="250px"
      bg="gray.300"
      color="white"
      className="fixed min-h-screen p-4 z-[1000]"
      right="0"
    >
      <FiXOctagon onClick={onClose} bg="transparent" color="black" />

      <Box color={"black"} mt={4}>
        Notificações / Informações
      </Box>
    </Box>
  );
}
