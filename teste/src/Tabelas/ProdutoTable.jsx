import React, { useEffect, useMemo, useRef, useState } from "react";
import CustomTable from "../components/CustomTable";
import debounce from "lodash.debounce";
import { Toaster, toaster } from "@/components/ui/toaster";
import { CiTextAlignCenter } from "react-icons/ci";

import {
  FaBarcode,
  FaBoxes,
  FaMoneyBillWave,
  FaUserCircle,
} from "react-icons/fa";
import {
  BsCashCoin,
  BsClipboardFill,
  BsCoin,
  BsFillBarChartLineFill,
  BsSpeedometer2,
} from "react-icons/bs";
import { FaBoxOpen, FaChartLine, FaPhone, FaTags } from "react-icons/fa6";

import {
  BsChevronExpand,
  BsFillCaretUpFill,
  BsFillCaretDownFill,
} from "react-icons/bs";
import { LuListFilter, LuText } from "react-icons/lu";
import { FiMail, FiEdit, FiTrash2, FiRefreshCcw, FiEye } from "react-icons/fi";
import usePopupManager from "../hooks/popupmanager";
import { useCallback } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { GoOrganization } from "react-icons/go";

import {
  IoBarChartSharp,
  IoClose,
  IoDocuments,
  IoShapesOutline,
} from "react-icons/io5";
import "../../src/styles/Pages.css";
import {
  FaUser,
  FaEnvelope,
  FaCalendarAlt,
  FaIdCard,
  FaAddressCard,
  FaEdit,
  FaWhatsapp,
} from "react-icons/fa";
import { Badge, Button, CloseButton, Drawer } from "@chakra-ui/react";
import { MdAttachMoney, MdOutlineLabel } from "react-icons/md";
import { PiCalculatorFill, PiCurrencyDollarFill } from "react-icons/pi";
import { RiShapeLine, RiVerifiedBadgeFill } from "react-icons/ri";
import { TbComponents } from "react-icons/tb";

const filtrosIniciais = {
  status: [],
  Formato: [],
  Unidade: [],
  dataInicial: null,
  dataFinal: null,
};

export default function ProdutosTable({
  fetchDataRef,
  onProdutoEditandoChange,
}) {
  const [produtoEditando, setProdutoEditando] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [enableResizing, setEnableResizing] = useState(false);
  const [columnSizes, setColumnSizes] = useState({});
  const [filters, setFilters] = useState(filtrosIniciais);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [linhaSelecionada, setLinhaSelecionada] = useState(null);
  const [selectionResetKey, setSelectionResetKey] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const abrirDrawerComDados = (linha) => {
    console.log("linha", linha);
    setLinhaSelecionada(linha);
    setIsDrawerOpen(true);
  };

  const debouncedSearchHandler = useCallback(
    debounce((value) => {
      setDebouncedSearch(value);
    }, 300),
    []
  );

  const filterConfig = useMemo(
    () => [
      {
        key: "status",
        label: "Status",
        options: [
          { value: "true", label: "Ativo" },
          { value: "false", label: "Inativo" },
        ],
      },
      {
        key: "Formato",
        label: "Formato",
        options: [
          { value: "Produto Final", label: "Produto Final" },
          { value: "Componente", label: "Componente" },
        ],
      },
      {
        key: "Unidade",
        label: "Unidade",
        options: [
          { value: "Kg", label: "Kg" },
          { value: "m", label: "m" },
          { value: "un", label: "un" },
        ],
      },
    ],
    []
  );

  const [hiddenColumns, setHiddenColumns] = useState([
    "Unidade",
    "Formato",
    "Data de Cadastro",
    "Preço de Custo",
    "Margem de Lucro",
    "Código GTIN",
    "Observações",
    "Status",
  ]);

  //PAGINAÇÃO

  const [totalItens, setTotalItens] = useState(0);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [itensPorPagina, setItensPorPagina] = useState(10);

  useEffect(() => {
    const updateHiddenColumns = () => {
      const width = window.innerWidth;
      let newHiddenColumns = [];

      if (width <= 1140) {
        newHiddenColumns = [
          "Código (SKU)",
          "Unidade",
          "Formato",
          "Data de Cadastro",
          "Data de Validade",
          "Preço de Custo",
          "Margem de Lucro",
          "Código GTIN",
          "Observações",
          "Status",
        ];
      } else if (width <= 1339) {
        newHiddenColumns = [
          "Código (SKU)",
          "Unidade",
          "Formato",
          "Data de Cadastro",
          "Data de Validade",
          "Preço de Custo",
          "Margem de Lucro",
          "Código GTIN",
          "Observações",
          "Status",
        ];
      } else if (width <= 1639) {
        newHiddenColumns = [
          "Código (SKU)",
          "Unidade",
          "Data de Cadastro",
          "Data de Validade",
          "Preço de Custo",
          "Margem de Lucro",
          "Código GTIN",
          "Observações",
          "Status",
        ];
      } else if (width <= 1920) {
        newHiddenColumns = [
          "Código (SKU)",
          "Unidade",
          "Data de Cadastro",
          "Data de Validade",
          "Preço de Custo",
          "Margem de Lucro",
          "Código GTIN",
          "Observações",
          "Status",
        ];
      } else {
        newHiddenColumns = [
          "Código (SKU)",
          "Unidade",
          "Data de Cadastro",
          "Data de Validade",
          "Preço de Custo",
          "Margem de Lucro",
          "Código GTIN",
          "Observações",
          "Status",
          "Ações",
        ];
      }

      setHiddenColumns(newHiddenColumns);
    };

    updateHiddenColumns();

    window.addEventListener("resize", updateHiddenColumns);
    return () => {
      window.removeEventListener("resize", updateHiddenColumns);
    };
  }, []);

  const toggleFilterValue = (filterKey, value) => {
    setFilters((prev) => {
      const current = prev[filterKey] || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, [filterKey]: updated };
    });
  };
  const popupKeys = [...filterConfig.map((f) => f.key), "dataCadastro"];

  const { popupStates, popupRefs, togglePopup } = usePopupManager(popupKeys);

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const fetchData = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        page: paginaAtual,
        limit: itensPorPagina,
        search: debouncedSearch,
      });

      // Adicionando os filtros
      if (filters.status.length > 0) {
        filters.status.forEach((status) => params.append("status", status));
      }

      if (filters.Formato.length > 0) {
        filters.Formato.forEach((formato) => params.append("formato", formato));
      }
      if (filters.Unidade.length > 0) {
        filters.Unidade.forEach((unidade) => params.append("unidade", unidade));
      }

      if (filters.dataInicial) {
        const dataInicialUTC = new Date(filters.dataInicial);
        dataInicialUTC.setUTCHours(0, 0, 0, 0);
        params.append("dataInicial", dataInicialUTC.toISOString());
      }

      if (filters.dataFinal) {
        const dataFinalUTC = new Date(filters.dataFinal);
        dataFinalUTC.setUTCHours(23, 59, 59, 999);
        params.append("dataFinal", dataFinalUTC.toISOString());
      }

      const response = await fetch(
        `http://localhost:5000/api/produtos?${params.toString()}`
      );
      const data = await response.json();
      console.log("data", data);
      const mappedData = data.data.map((produto) => ({
        id: produto.id,
        Descrição: produto.descricao,
        "Código (SKU)": produto.codigoSKU,
        Unidade: produto.unidade,
        Estoque: produto.estoque,
        Formato: produto.formato,
        "Preço de Custo": produto.precoCusto,
        "Margem de Lucro": produto.margemLucro,
        "Preço de Venda": produto.precoVenda,
        "Código GTIN": produto.codigoBarrasGTIN,
        "Data de Cadastro": formatarData(produto.createdAt),
        "Data de Validade": produto.dataValidade,
        dataCadastroRaw: produto.createdAt,
        Status: produto.status,
        ["Observações"]: produto.observacoes,
        Origem: produto.origem,
        NCM: produto.ncm,
        CEST: produto.cest,
        CSOSN: produto.csosn,
        ["ICMS Interno"]: produto.icmsInterno,
        ["Base de Calculo"]: produto.baseCalculo,
        IPI: produto.ipi,
        ["CST PIS"]: produto.cstPis,
        ["CST COFINS"]: produto.cstCofins,
        ["Peso Bruto"]: produto.pesoBruto,
        ["Peso Liquido"]: produto.pesoLiquido,

        ["Composições"]: produto.composicoes,
        ["Fornecedores"]: produto.fornecedores,
      }));

      setProdutos(mappedData);
      setTotalPaginas(data.totalPages);
      setTotalItens(data.total);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  }, [paginaAtual, itensPorPagina, debouncedSearch, filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const renderFilterHeader = useCallback(
    (key) => {
      const config = filterConfig.find((f) => f.key === key);
      const selected = filters[key] || [];
      const isSelected = selected.length > 0;

      return (
        <div className="relative gap-3 flex items-center">
          <span>{config.label}</span>
          <div
            className={`cursor-pointer filter-icon !p-1 !rounded-[4px] ${
              isSelected ? "!bg-blue-200" : "!bg-gray-100 hover:!bg-gray-300"
            }`}
            onClick={() => togglePopup(key)}
          >
            <LuListFilter
              className={` ${isSelected ? "text-blue-900" : "text-black"}`}
            />
          </div>
          {popupStates[key] && (
            <div
              ref={popupRefs[key]}
              className="absolute top-9 !w-60 bg-white border border-gray-200 !rounded-md shadow-lg z-10 !p-4"
            >
              <h2 className="!text-sm !font-semibold !mb-2">
                Filtrar por {config.label}
              </h2>
              <div className="flex flex-col !gap-2 !text-sm">
                {config.options.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center !gap-2"
                  >
                    <input
                      type="checkbox"
                      checked={selected.includes(option.value)}
                      onChange={() => toggleFilterValue(key, option.value)}
                    />
                    {option.label}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    },
    [filters, popupStates, popupRefs, togglePopup, filterConfig]
  );

  const renderDateRangeFilterHeader = useCallback(() => {
    const isActive = filters.dataInicial || filters.dataFinal;

    return (
      <div className="relative gap-3 flex items-center">
        <span>Data de Cadastro</span>
        <div
          className={`cursor-pointer filter-icon !p-1 !rounded-[4px] ${
            isActive ? "bg-blue-200" : "bg-gray-100 hover:bg-gray-300"
          }`}
          onClick={() => togglePopup("dataCadastro")}
        >
          <FaRegCalendarAlt
            className={`text-[15px]  ${
              isActive ? "text-blue-900" : "text-black"
            }`}
          />
        </div>

        {popupStates["dataCadastro"] && (
          <div
            ref={popupRefs["dataCadastro"]}
            className="absolute top-9 w-72 bg-white !border !border-gray-200 !rounded-md !shadow-lg z-10 !p-4"
          >
            <h2 className="!text-sm !font-semibold !mb-2">
              Filtrar por intervalo
            </h2>
            <div className="!flex !flex-col !gap-2 !text-sm">
              <label>
                Data Inicial:
                <input
                  type="date"
                  className=" !border !px-2 !py-1 !rounded !mt-1"
                  value={filters.dataInicial || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dataInicial: e.target.value || null,
                    }))
                  }
                />
              </label>
              <label>
                Data Final:
                <input
                  type="date"
                  className=" !border !px-2 !py-1 !rounded !mt-1"
                  value={filters.dataFinal || ""}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      dataFinal: e.target.value || null,
                    }))
                  }
                />
              </label>
              {(filters.dataInicial || filters.dataFinal) && (
                <button
                  className="mt-2 text-xs text-blue-500 underline"
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      dataInicial: null,
                      dataFinal: null,
                    }))
                  }
                >
                  Limpar filtro
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }, [
    filters.dataInicial,
    filters.dataFinal,
    popupStates,
    popupRefs,
    togglePopup,
  ]);

  const [columnOrder, setColumnOrder] = useState([
    "Selecionar",
    "Código (SKU)",
    "Descrição",
    "Formato",
    "Estoque",
    "Unidade",
    "Data de Cadastro",
    "Data de Validade",
    "Preço de Custo",
    "Margem de Lucro",
    "Preço de Venda",
    "Código GTIN",
    "Observações",
    "Status",
    "Ações",
  ]);

  // Componente reutilizável para cabeçalhos ordenáveis
  function SortableHeaderButton({ label, column }) {
    return (
      <button
        className="flex items-center gap-1 cursor-pointer"
        onClick={() => {
          if (column.getIsSorted() === "desc") {
            column.clearSorting();
          } else {
            column.toggleSorting(column.getIsSorted() === "asc");
          }
        }}
      >
        {label}{" "}
        {column.getIsSorted() === "asc" ? (
          <BsFillCaretUpFill />
        ) : column.getIsSorted() === "desc" ? (
          <BsFillCaretDownFill />
        ) : (
          <BsChevronExpand />
        )}
      </button>
    );
  }

  const columns = useMemo(() => {
    const baseColumns = [
      // COLUNA SELECIONAR
      {
        id: "Selecionar",
        accessorKey: "⬜",
        enableResizing,
        header: ({ table }) => (
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={table.getIsAllPageRowsSelected()}
            onChange={table.getToggleAllPageRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
        size: 70,
        minSize: 60,
      },
      // COLUNA DESCRICAO
      {
        id: "Descrição",
        accessorKey: "Descrição",
        header: ({ column }) => (
          <SortableHeaderButton label="Descrição" column={column} />
        ),
        enableSorting: true,
        enableResizing: true,
        minSize: 200,
      },
      // COLUNA ESTOQUE
      {
        id: "Estoque",
        accessorKey: "Estoque",
        enableSorting: true,
        enableResizing: true,
        minSize: 200,
        cell: ({ row, getValue }) => (
          <div>
            {getValue()} {row.original.Unidade}
          </div>
        ),
      },
      // COLUNA UNIDADE
      {
        id: "Unidade",
        accessorKey: "Unidade",
        header: () => renderFilterHeader("Unidade"),
        enableSorting: true,
        enableResizing: true,
        minSize: 200,
      },

      // COLUNA FORMATO
      {
        id: "Formato",
        accessorKey: "Formato",
        header: () => renderFilterHeader("Formato"),
        enableSorting: true,
        enableResizing: true,
        minSize: 200,
      },

      // COLUNA PREÇO DE CUSTO
      {
        id: "Preço de Custo",
        accessorKey: "Preço de Custo",
        enableSorting: true,
        enableResizing: true,
        minSize: 200,
        cell: ({ getValue }) => <span>R$ {getValue()}</span>,
      },
      // COLUNA OBSERVACOES
      {
        id: "Observações",
        accessorKey: "Observações",
        enableSorting: true,
        enableResizing: true,
        minSize: 200,
      },

      // COLUNA STATUS
      {
        id: "Status",
        accessorKey: "Status",
        header: () => renderFilterHeader("status"),
        enableSorting: true,
        enableResizing: true,
        minSize: 150,
        cell: ({ getValue }) => (
          <span
            className={`!px-3 !py-1 !rounded-full !text-xs !font-semibold ${
              getValue()
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {getValue() ? "Ativo" : "Inativo"}
          </span>
        ),
      },
      // COLUNA AÇÕES
      {
        id: "Ações",
        accessorKey: "Ações",
        header: "Ações",
        cell: ({ row }) => (
          <div className="flex gap-1 !text-[19px]">
            <div
              className="cursor-pointer !bg-[#f7f7f7] hover:!bg-[#dcdcdc] !p-1 !rounded-lg"
              onClick={() => abrirDrawerComDados(row.original)}
            >
              <FiEye className=" text-black" title="Visualizar" />
            </div>

            <div
              className="cursor-pointer !bg-[#f7f7f7] hover:!bg-[#dcdcdc] !p-1 !rounded-lg"
              onClick={() => handleSetProdutoEditando(row.original)}
            >
              <FiEdit className="text-orange-500" />
            </div>

            <div className="cursor-pointer !bg-[#f7f7f7] hover:!bg-[#dcdcdc] !p-1 !rounded-lg">
              <FiTrash2
                className=" text-red-500"
                onClick={() => handleDelete(row.original.id)}
              />
            </div>
          </div>
        ),
        enableResizing,
        size: 150,
        minSize: 170,
      },
      // COLUNA MARGEM DE LUCRO
      {
        id: "Margem de Lucro",
        header: "Margem de Lucro",
        accessorKey: "Margem de Lucro",
        size: 250,
        minSize: 150,
        cell: ({ getValue }) => <span>{getValue()}%</span>,
      },
      // COLUNA PREÇO DE VENDA
      {
        id: "Preço de Venda",
        header: "Preço de Venda",
        accessorKey: "Preço de Venda",
        minSize: 200,
        cell: ({ getValue }) => <span>R$ {getValue()}</span>,
      },

      // COLUNA DATA DE CADASTRO
      {
        id: "Data de Cadastro",
        header: renderDateRangeFilterHeader,
        accessorKey: "Data de Cadastro",
        size: 200,
        minSize: 200,
      },
      // COLUNA DATA DE VALIDADE
      {
        id: "Data de Validade",
        accessorKey: "Data de Validade",
        size: 200,
        minSize: 200,
      },
      // COLUNA CODIGOSKU
      {
        id: "Código (SKU)",
        accessorKey: "Código (SKU)",
        size: 150,
        minSize: 150,
      },
      // COLUNA CODIGO DE BARRAS GTIN
      {
        id: "Código GTIN",
        accessorKey: "Código GTIN",
        size: 250,
        minSize: 150,
      },

      // COLUNA ORIGEM
      {
        id: "Origem",
        accessorKey: "Origem",
      },

      // COLUNA NCM
      {
        id: "NCM",
        accessorKey: "NCM",
      },

      // COLUNA CEST
      {
        id: "CEST",
        accessorKey: "CEST",
      },
      // COLUNA CSOSN
      {
        id: "CSOSN",
        accessorKey: "CSOSN",
      },
      // COLUNA ICMS INTERNO
      {
        id: "ICMS Interno",
        accessorKey: "ICMS Interno",
      },
      // COLUNA BASE DE CALCULO
      {
        id: "Base de Calculo",
        accessorKey: "Base de Calculo",
      },
      // COLUNA IPI
      {
        id: "IPI",
        accessorKey: "IPI",
      },
      // COLUNA CST PIS
      {
        id: "CST PIS",
        accessorKey: "CST PIS",
      },
      // COLUNA CST COFINS
      {
        id: "CST COFINS",
        accessorKey: "CST COFINS",
      },
      // COLUNA PESO BRUTO
      {
        id: "Peso Bruto",
        accessorKey: "Peso Bruto",
      },
      // COLUNA PESO LIQUIDO
      {
        id: "Peso Liquido",
        accessorKey: "Peso Liquido",
      },

      // COLUNA COMPOSIÇÕES
      {
        id: "Composições",
        accessorKey: "Composições",
      },
      // COLUNA FORNECEDORES
      {
        id: "Fornecedores",
        accessorKey: "Fornecedores",
      },
    ];

    return columnOrder
      .map((colId) => baseColumns.find((col) => col.id === colId))
      .filter(Boolean);
  }, [
    columnOrder,
    enableResizing,
    columnSizes,
    renderFilterHeader,
    renderDateRangeFilterHeader,
  ]);

  function BotaoLimparFiltros({ onClick }) {
    return (
      <button
        className="cursor-pointer !rounded !text-sm font-medium !text-gray-400 hover:!text-gray-600 flex items-center gap-2 underline"
        onClick={onClick}
      >
        <IoClose /> Limpar Filtros
      </button>
    );
  }

  const temFiltrosAtivos = useMemo(() => {
    const algumFiltroSelecionado = Object.entries(filters).some(([, value]) => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== "";
    });

    return algumFiltroSelecionado;
  }, [filters]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Tem certeza que deseja excluir este produto?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/produtos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toaster.create({
          title: "Produto excluído",
          description: "O produto foi removido com sucesso.",
          type: "success",
          duration: 3000,
        });
        fetchData();
      } else {
        throw new Error("Erro ao excluir o produto.");
      }
    } catch (error) {
      toaster.error(error.message || "Erro inesperado ao excluir produto.");
    }
  };

  useEffect(() => {
    if (fetchDataRef) {
      fetchDataRef.current = fetchData;
    }
  }, [fetchData, fetchDataRef]);

  const drawerContentRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        drawerContentRef.current &&
        !drawerContentRef.current.contains(event.target)
      ) {
        setIsDrawerOpen(false); // Fecha o Drawer se clicar fora do conteúdo
      }
    };

    // Adiciona o eventListener quando o componente for montado
    document.addEventListener("mousedown", handleOutsideClick);

    // Remove o eventListener quando o componente for desmontado
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const Field = ({ label, value, icon }) => (
    <div className=" !pb-2 !flex flex-col gap-1 !border-b ">
      <div className="!flex gap-2 !text-xs !text-gray-500">
        {icon} {label}
      </div>
      <div className="!text-sm !font-medium !text-gray-800 !mt-1 truncate">
        {value}
      </div>
    </div>
  );

  const handleSetProdutoEditando = (produto) => {
    setProdutoEditando(produto);
    if (onProdutoEditandoChange) onProdutoEditandoChange(produto);
  };

  useEffect(() => {
    console.log(produtos);
  }, [produtos]);

  const [composicaoAberta, setComposicaoAberta] = useState(null);
  const toggleComposicao = (index) => {
    setComposicaoAberta(composicaoAberta === index ? null : index);
  };

  return (
    <div>
      <CustomTable
        data={produtos}
        columns={columns}
        setColumnOrder={setColumnOrder}
        enableResizing={enableResizing}
        setEnableResizing={setEnableResizing}
        initiallyHiddenColumns={hiddenColumns}
        extraHeaderContent={
          temFiltrosAtivos ? (
            <BotaoLimparFiltros onClick={() => setFilters(filtrosIniciais)} />
          ) : null
        }
        paginaAtual={paginaAtual}
        totalPaginas={totalPaginas}
        setPaginaAtual={setPaginaAtual}
        totalItens={totalItens}
        itensPorPagina={itensPorPagina}
        onChangeItensPorPagina={(value) => {
          setItensPorPagina(value);
          setPaginaAtual(1);
        }}
        search={search}
        onSearchChange={setSearch}
        debouncedSearchHandler={debouncedSearchHandler}
        onRowSelectionChange={(selectedRows) => {
          setSelectedRows(selectedRows);
        }}
        externalRowSelectionResetKey={selectionResetKey}
        onRowDoubleClick={abrirDrawerComDados}
      />

      {selectedRows.length > 0 && (
        <div className="fixed bottom-4 left-[50%] -translate-x-1/2 bg-white shadow-lg !border !border-gray-300 rounded-lg !px-6 !py-4 !z-50 !flex !items-center gap-4 animate-fade-in">
          <span className="!text-sm">
            {selectedRows.length} produto{selectedRows.length > 1 ? "s" : ""}{" "}
            selecionado
            {selectedRows.length > 1 ? "s" : ""}
          </span>
          <button
            className="!bg-red-500 hover:!bg-red-600 !text-white !px-4 !py-1.5 !text-sm !rounded"
            onClick={async () => {
              const confirm = window.confirm(
                `Tem certeza que deseja deletar ${selectedRows.length} produto(s)?`
              );
              if (!confirm) return;

              try {
                const ids = selectedRows.map((row) => row.id).join(",");
                const response = await fetch(
                  `http://localhost:5000/api/produtos/${ids}`,
                  {
                    method: "DELETE",
                  }
                );

                if (response.ok) {
                  toaster.create({
                    title: "Produtos deletados",
                    description: "Todos os selecionados foram removidos.",
                    type: "success",
                    duration: 3000,
                  });
                  fetchData(); // atualiza a lista
                  setSelectedRows([]);
                  setSelectionResetKey((prev) => prev + 1);
                } else {
                  throw new Error("Erro ao deletar produtos.");
                }
              } catch (error) {
                toaster.error(error.message);
              }
            }}
          >
            Deletar
          </button>
        </div>
      )}

      {linhaSelecionada && (
        <Drawer.Root open={isDrawerOpen}>
          <Drawer.Backdrop
            className="!bg-[#00000021]"
            onClick={() => setIsDrawerOpen(false)}
          />
          <Drawer.Positioner>
            <Drawer.Content ref={drawerContentRef}>
              <CloseButton
                className="!absolute !top-2 !right-4 w-1 !text-gray-600 !bg-gray-100 hover:!bg-gray-200 !rounded-[10px] transition"
                onClick={() => {
                  setIsDrawerOpen(false);
                }}
              >
                <IoClose size={24} />
              </CloseButton>

              <Drawer.Header className="!px-6 !pt-6 !pb-4 !border-b">
                <h2 className="!text-[20px] !font-semibold !text-gray-800 flex gap-3 items-center">
                  <FaBoxes /> Produto
                </h2>
              </Drawer.Header>

              <Drawer.Body className="!flex-grow !overflow-y-auto !pb-[70px] !px-6 !py-4 !space-y-6 !text-sm !text-gray-700">
                {/* Nome no topo com destaque */}

                <div className="flex justify-between items-center !mb-4 ">
                  <div className="!text-xs !text-gray-500 !uppercase !mb-0">
                    Código (ID)
                  </div>
                  <div className=" !text-[13px] !py-2 !px-5 !font-bold !text-gray-700 !bg-gray-100  !rounded-lg !inline-block ">
                    {" "}
                    {linhaSelecionada.id}
                  </div>
                </div>

                <div className="!w-full !text-center !text-[14px] !text-gray-800 !font-semibold !bg-gray-100 !px-3 !py-4 !border !border-gray-400 !rounded-lg !inline-block">
                  {linhaSelecionada.Descrição}
                </div>

                {/* Seção - Características */}
                <div>
                  <h3 className="!bg-gray-100 !text-center !py-2 rounded-[10px] !text-sm !font-bold !text-gray-600 !mb-4">
                    Características
                  </h3>
                  <div className="!space-y-4">
                    <Field
                      label="Formato"
                      value={`${linhaSelecionada.Formato} `}
                      icon={<RiShapeLine />}
                    />

                    <Field
                      label="Código (SKU)"
                      value={`${linhaSelecionada["Código (SKU)"]} `}
                      icon={<FaTags />}
                    />

                    <Field
                      label="Estoque"
                      value={linhaSelecionada.Estoque || "-"}
                      icon={<FaBoxes className="text-gray-500" />}
                    />
                    <Field
                      label="Unidade"
                      value={linhaSelecionada.Unidade || "-"}
                      icon={<BsSpeedometer2 className="text-gray-500" />}
                    />
                    <Field
                      label="Preço de Custo"
                      value={`R$ ${linhaSelecionada["Preço de Custo"]} `}
                      icon={<PiCalculatorFill />}
                    />
                    <Field
                      label="Margem de Lucro"
                      value={`${linhaSelecionada["Margem de Lucro"]} %`}
                      icon={<BsFillBarChartLineFill />}
                    />
                    <Field
                      label="Preço de Venda"
                      value={`R$ ${linhaSelecionada["Preço de Venda"]} `}
                      icon={<FaMoneyBillWave />}
                    />

                    <Field
                      label="Código GTIN"
                      value={linhaSelecionada["Código GTIN"]}
                      icon={<FaBarcode className="text-gray-500" />}
                    />

                    <Field
                      label="Status"
                      icon={<RiVerifiedBadgeFill />}
                      value={
                        <span
                          className={`!inline-block !px-2 !py-0.5 !rounded-full !text-xs !font-medium ${
                            linhaSelecionada.Status
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {linhaSelecionada.Status ? "Ativo" : "Inativo"}
                        </span>
                      }
                    />
                    {linhaSelecionada.Email && (
                      <Field
                        label="Email"
                        value={linhaSelecionada.Email}
                        icon={<FaEnvelope className="text-gray-500" />}
                      />
                    )}

                    <Field
                      icon={<FaCalendarAlt className="text-gray-500" />}
                      label="Data de Validade"
                      value={linhaSelecionada["Data de Validade"] || "-"}
                    />

                    {linhaSelecionada["Data de Cadastro"] && (
                      <Field
                        icon={<FaCalendarAlt className="text-gray-500" />}
                        label="Data de Cadastro"
                        value={linhaSelecionada["Data de Cadastro"]}
                      />
                    )}

                    <Field
                      label="Observações"
                      value={linhaSelecionada.Observações || "-"}
                      icon={<LuText className="text-gray-500" />}
                    />
                  </div>
                </div>

                {/* Seção - Composição */}
                {linhaSelecionada["Composições"].length > 0 && (
                  <div>
                    <h3 className="!bg-gray-100 !text-center !py-2 rounded-[10px] !text-sm !font-bold !text-gray-600 !mb-4">
                      Composição
                    </h3>
                    <div className="!space-y-4">
                      <Field
                        label="Componentes"
                        value={`${linhaSelecionada["Composições"].length} itens`}
                        icon={<TbComponents className="text-gray-500" />}
                      />

                      {linhaSelecionada["Composições"].map(
                        (composicao, index) => (
                          <div
                            key={composicao.id}
                            className="!border !border-gray-200 !rounded-lg !p-4 !flex !flex-col !gap-2 !bg-white hover:!bg-gray-50 !cursor-pointer !transition-all !duration-300"
                            onClick={() => toggleComposicao(index)}
                          >
                            <div className="flex justify-between items-center gap-5">
                              <span className="!bg-gray-200 !px-2 !py-1 !rounded-[6px] text-sm font-medium text-gray-700">
                                {index + 1}
                              </span>
                              <span className="text-sm font-bold text-gray-900 !truncate">
                                {composicao.componente.descricao}
                              </span>
                            </div>

                            {/* Conteúdo oculto/expansível */}
                            {composicaoAberta === index && (
                              <div className="mt-4 space-y-2 animate-fade-in">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    Qtd. necessária:
                                  </span>
                                  <span className="text-sm text-gray-900">
                                    {composicao.quantidade}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm font-medium text-gray-700">
                                    Estoque disponível:
                                  </span>
                                  <span className="text-sm text-gray-900">
                                    {composicao.componente.estoque}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </Drawer.Body>

              <Drawer.Footer className="!w-full !px-6 !py-4 !border-t flex flex-col gap-3 bg-white">
                <button
                  onClick={() => {
                    setIsDrawerOpen(false); // fecha o drawer
                    onProdutoEditandoChange(linhaSelecionada); // abre o modal no ProdutosPage
                  }}
                  className="!w-full flex items-center justify-center gap-2 !bg-blue-600 hover:!bg-blue-700 !text-white !font-semibold !py-3 !rounded-lg transition"
                >
                  <FaEdit className="!text-[20px]" />
                  Editar Informações
                </button>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Positioner>
        </Drawer.Root>
      )}
    </div>
  );
}
