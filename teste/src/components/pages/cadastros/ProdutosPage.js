import ClientesTable from "@/Tabelas/ClientesTable";
import { Box, Button, Dialog, Portal, CloseButton } from "@chakra-ui/react";
import { BsPrinterFill } from "react-icons/bs";
import { IoPeopleSharp } from "react-icons/io5";
import { LuPlus } from "react-icons/lu";
import { useRef, useState } from "react";
import * as XLSX from "xlsx";
import { FiRefreshCcw } from "react-icons/fi";
import { MdBusinessCenter } from "react-icons/md";
import VendedoresTable from "@/Tabelas/VendedoresTable";

export default function ProdutosPage() {
  const [isExporting, setIsExporting] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);
  const fetchDataRef = useRef(null);

  const fetchData = async () => {
    const response = await fetch(
      "http://localhost:5000/api/vendedores?limit=1000"
    );
    const json = await response.json();
    return json.data;
  };
  const exportToExcel = async () => {
    setIsExporting(true);
    const data = await fetchData();
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");
    XLSX.writeFile(workbook, "clientes.xlsx");
    setIsExporting(false);
  };
  const [tableKey, setTableKey] = useState(0);

  return <div>Produtos</div>;
}
