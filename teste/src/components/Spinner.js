// components/Spinner.js
"use client";
import { Icon } from "@chakra-ui/react";
import { FaSpinner } from "react-icons/fa";
import { keyframes } from "@emotion/react";
import { ImSpinner } from "react-icons/im";
import { PiSpinner } from "react-icons/pi";

const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

export default function Spinner() {
  return (
    <Icon
      as={ImSpinner}
      animation={`${spin} 1s linear infinite`}
      fontSize="20px"
    />
  );
}
