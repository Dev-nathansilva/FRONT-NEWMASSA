import React, { useEffect, useMemo, useRef, useState } from "react";
import CustomTable from "../components/CustomTable";
import debounce from "lodash.debounce";
import { Toaster, toaster } from "@/components/ui/toaster";
import { FaUserCircle } from "react-icons/fa";
import { BsClipboardFill } from "react-icons/bs";
import { FaPhone } from "react-icons/fa6";

import {
  BsChevronExpand,
  BsFillCaretUpFill,
  BsFillCaretDownFill,
} from "react-icons/bs";
import { LuListFilter } from "react-icons/lu";
import { FiMail, FiEdit, FiTrash2, FiRefreshCcw, FiEye } from "react-icons/fi";
import usePopupManager from "../hooks/popupmanager";
import { useCallback } from "react";
import { FaRegCalendarAlt } from "react-icons/fa";
import { GoOrganization } from "react-icons/go";

import { IoClose } from "react-icons/io5";
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
import { MdOutlineLabel } from "react-icons/md";

const filtrosIniciais = {
  status: [],
  Tipo: [],
  dataInicial: null,
  dataFinal: null,
};

export default function ClientesTable({
  fetchDataRef,
  onClienteEditandoChange,
}) {
  const [clienteEditando, setClienteEditando] = useState(null);
  const [clientes, setClientes] = useState([]);
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
          { value: "Ativo", label: "Ativo" },
          { value: "Inativo", label: "Inativo" },
        ],
      },
      {
        key: "Tipo",
        label: "Tipo",
        options: [
          { value: "PessoaFisica", label: "Pessoa Física" },
          { value: "PessoaJuridica", label: "Pessoa Jurídica" },
          { value: "Empresa", label: "Empresa" },
        ],
      },
    ],
    []
  );

  const [hiddenColumns, setHiddenColumns] = useState([
    "Email",
    "Telefone",
    "Inscricao Estadual",
    "Data de Cadastro",
    "Endereco",
    "Complemento",
    "Bairro",
    "CEP",
    "Credito",
    "Cidade",
    "Observações",
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
          "Email",
          "Telefone",
          "Inscricao Estadual",
          "Data de Cadastro",
          "Endereco",
          "Complemento",
          "Bairro",
          "CEP",
          "Credito",
          "Cidade",
          "Observações",
        ];
      } else if (width <= 1339) {
        newHiddenColumns = [
          "Email",
          "Telefone",
          "Inscricao Estadual",
          "Data de Cadastro",
          "CPF/CNPJ",
          "Endereco",
          "Complemento",
          "Bairro",
          "CEP",
          "Credito",
          "Cidade",
          "Observações",
        ];
      } else if (width <= 1639) {
        newHiddenColumns = [
          "Email",
          "Telefone",
          "Inscricao Estadual",
          "Data de Cadastro",
          "Endereco",
          "Complemento",
          "Bairro",
          "CEP",
          "Credito",
          "Cidade",
          "Observações",
        ];
      } else if (width <= 1920) {
        newHiddenColumns = [
          "Telefone",
          "Inscricao Estadual",
          "Data de Cadastro",
          "Endereco",
          "Complemento",
          "Bairro",
          "CEP",
          "Credito",
          "Cidade",
          "Observações",
        ];
      } else {
        newHiddenColumns = [
          "Telefone",
          "Inscricao Estadual",
          "Data de Cadastro",
          "Endereco",
          "Complemento",
          "Bairro",
          "CEP",
          "Credito",
          "Cidade",
          "Observações",
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

      if (filters.Tipo.length > 0) {
        filters.Tipo.forEach((tipo) => params.append("tipo", tipo));
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
        `http://localhost:5000/api/clientes?${params.toString()}`
      );
      const data = await response.json();
      const mappedData = data.data.map((cliente) => ({
        id: cliente.id,
        Nome: cliente.nome,
        "CPF/CNPJ": cliente.documento,
        Tipo:
          {
            PessoaFisica: "Pessoa Física",
            PessoaJuridica: "Pessoa Jurídica",
            Empresa: "Empresa",
          }[cliente.tipo] || cliente.tipo,
        status: cliente.status,
        Email: cliente.email,
        Telefone: cliente.telefone,
        "Inscrição Estadual": cliente.inscricaoEstadual,
        "Data de Cadastro": formatarData(cliente.dataCadastro),
        dataCadastroRaw: cliente.dataCadastro,
        Endereço: cliente.endereco,
        Complemento: cliente.complemento,
        Bairro: cliente.bairro,
        CEP: cliente.cep,
        Cidade: cliente.cidade,
        ["Crédito"]: cliente.credito,
        ["Observações"]: cliente.observacoes,
      }));

      setClientes(mappedData);
      setTotalPaginas(data.totalPages);
      setTotalItens(data.total);
    } catch (error) {
      console.error("Erro ao buscar clientes:", error);
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
    "Nome",
    "Tipo",
    "CPF/CNPJ",
    "Email",
    "Telefone",
    "Inscricao Estadual",
    "Data de Cadastro",
    "Endereco",
    "Complemento",
    "Bairro",
    "Cidade",
    "CEP",
    "Credito",
    "Observações",
    "status",
    "ações",
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
      // COLUNA NOME
      {
        id: "Nome",
        accessorKey: "Nome",
        header: ({ column }) => (
          <SortableHeaderButton label="Nome" column={column} />
        ),
        enableSorting: true,
        enableResizing: true,
        minSize: 200,
      },
      // COLUNA CPF/CNPJ
      {
        id: "CPF/CNPJ",
        accessorKey: "CPF/CNPJ",

        enableSorting: true,
        enableResizing: true,
        minSize: 200,
      },
      // COLUNA TIPO
      {
        id: "Tipo",
        accessorKey: "Tipo",
        header: () => renderFilterHeader("Tipo"),
        enableSorting: true,
        enableResizing: true,
        minSize: 200,
      },

      // COLUNA TELEFONE
      {
        id: "Telefone",
        accessorKey: "Telefone",
        enableSorting: true,
        enableResizing: true,
        minSize: 200,
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
        id: "status",
        accessorKey: "status",
        header: () => renderFilterHeader("status"),
        enableSorting: true,
        enableResizing: true,
        minSize: 150,
        cell: ({ getValue }) => (
          <span
            className={`!px-3 !py-1 !rounded-full !text-xs !font-semibold ${
              getValue() === "Ativo"
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600"
            }`}
          >
            {getValue()}
          </span>
        ),
      },
      // COLUNA AÇÕES
      {
        id: "ações",
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
              onClick={() => {
                const email = row.original.Email;
                if (email) {
                  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;
                  window.open(gmailUrl, "_blank");
                } else {
                  alert("Email não disponível");
                }
              }}
              title={`Enviar email para ${row.original.Email}`}
            >
              <FiMail className="text-black" />
            </div>

            <div
              className="cursor-pointer !bg-[#f7f7f7] hover:!bg-[#dcdcdc] !p-1 !rounded-lg"
              onClick={() => handleSetClienteEditando(row.original)}
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
      // COLUNA EMAIL
      {
        id: "Email",
        header: "Email",
        accessorKey: "Email",
        enableHiding: true,
        size: 250,
        minSize: 150,
      },
      // COLUNA INSCRIÇÃO ESTADUAL
      {
        id: "Inscricao Estadual",
        header: "Inscrição Estadual",
        accessorKey: "Inscrição Estadual",
        enableHiding: true,
        minSize: 200,
      },
      // COLUNA DATA DE CADASTRO
      {
        id: "Data de Cadastro",
        header: renderDateRangeFilterHeader,
        accessorKey: "Data de Cadastro",
        enableHiding: true,
        size: 200,
        minSize: 200,
      },
      // COLUNA ENDEREÇO
      {
        id: "Endereco",
        accessorKey: "Endereço",
        enableHiding: true,
        size: 250,
        minSize: 150,
      },
      // COLUNA COMPLEMENTO
      {
        id: "Complemento",
        accessorKey: "Complemento",
        enableHiding: true,
        size: 200,
        minSize: 150,
      },
      // COLUNA CIDADE
      {
        id: "Cidade",
        accessorKey: "Cidade",
        enableHiding: true,
        size: 200,
        minSize: 150,
      },
      // COLUNA BAIRRO
      {
        id: "Bairro",
        accessorKey: "Bairro",
        enableHiding: true,
        size: 200,
        minSize: 150,
      },
      // COLUNA CEP
      {
        id: "CEP",
        accessorKey: "CEP",
        enableHiding: true,
        size: 200,
        minSize: 150,
      },
      // COLUNA CREDITO
      {
        id: "Credito",
        accessorKey: "Crédito",
        enableHiding: true,
        minSize: 150,
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
      "Tem certeza que deseja excluir este cliente?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/clientes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toaster.create({
          title: "Cliente excluído",
          description: "O cliente foi removido com sucesso.",
          type: "success",
          duration: 3000,
        });
        fetchData();
      } else {
        throw new Error("Erro ao excluir o cliente.");
      }
    } catch (error) {
      toaster.error(error.message || "Erro inesperado ao excluir cliente.");
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

  const handleSetClienteEditando = (cliente) => {
    setClienteEditando(cliente);
    if (onClienteEditandoChange) onClienteEditandoChange(cliente);
  };

  return (
    <div>
      <CustomTable
        data={clientes}
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
            {selectedRows.length} cliente{selectedRows.length > 1 ? "s" : ""}{" "}
            selecionado
            {selectedRows.length > 1 ? "s" : ""}
          </span>
          <button
            className="!bg-red-500 hover:!bg-red-600 !text-white !px-4 !py-1.5 !text-sm !rounded"
            onClick={async () => {
              const confirm = window.confirm(
                `Tem certeza que deseja deletar ${selectedRows.length} cliente(s)?`
              );
              if (!confirm) return;

              try {
                const ids = selectedRows.map((row) => row.id).join(",");
                const response = await fetch(
                  `http://localhost:5000/api/clientes/${ids}`,
                  {
                    method: "DELETE",
                  }
                );

                if (response.ok) {
                  toaster.create({
                    title: "Clientes deletados",
                    description: "Todos os selecionados foram removidos.",
                    type: "success",
                    duration: 3000,
                  });
                  fetchData(); // atualiza a lista
                  setSelectedRows([]);
                  setSelectionResetKey((prev) => prev + 1);
                } else {
                  throw new Error("Erro ao deletar clientes.");
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
                  <FaUserCircle /> Cliente
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
                  {linhaSelecionada.Nome}
                </div>

                {/* Seção 1 - Dados Cadastrais */}
                <div>
                  <h3 className="!bg-gray-100 !text-center !py-2 rounded-[10px] !text-sm !font-bold !text-gray-600 !mb-4">
                    Dados Cadastrais
                  </h3>
                  <div className="!space-y-4">
                    <Field
                      label="CPF/CNPJ"
                      value={linhaSelecionada["CPF/CNPJ"]}
                      icon={<FaAddressCard className="text-gray-500" />}
                    />
                    <Field
                      label="Tipo"
                      value={linhaSelecionada.Tipo}
                      icon={<BsClipboardFill />}
                    />
                    <Field
                      label="Status"
                      icon={<MdOutlineLabel />}
                      value={
                        <span
                          className={`!inline-block !px-2 !py-0.5 !rounded-full !text-xs !font-medium ${
                            linhaSelecionada.status === "Ativo"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {linhaSelecionada.status}
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
                    {linhaSelecionada.Telefone && (
                      <Field
                        label="Telefone"
                        value={linhaSelecionada.Telefone}
                        icon={<FaPhone className="text-gray-500" />}
                      />
                    )}

                    <Field
                      label="Inscrição Estadual"
                      icon={<GoOrganization />}
                      value={
                        linhaSelecionada["Inscricao Estadual"]
                          ?.toString()
                          .trim() || "-"
                      }
                    />

                    {linhaSelecionada["Data de Cadastro"] && (
                      <Field
                        icon={<FaCalendarAlt className="text-gray-500" />}
                        label="Data de Cadastro"
                        value={linhaSelecionada["Data de Cadastro"]}
                      />
                    )}
                  </div>
                </div>

                {/* Seção 2 - Endereços */}
                <div>
                  <h3 className="!bg-gray-100 !text-center !py-2 rounded-[10px] !text-sm !font-bold !text-gray-600 !mb-4">
                    Endereços
                  </h3>
                  <div className="!space-y-4">
                    <Field
                      label="Endereço"
                      value={linhaSelecionada.Endereço || "-"}
                    />
                    <Field
                      label="Cidade"
                      value={linhaSelecionada.Cidade || "-"}
                    />
                    <Field label="CEP" value={linhaSelecionada.CEP || "-"} />
                    <Field
                      label="Bairro"
                      value={linhaSelecionada.Bairro || "-"}
                    />
                    <Field
                      label="Complemento"
                      value={linhaSelecionada.Complemento || "-"}
                    />
                  </div>
                </div>

                {/* Seção 3 - Informações Adicionais */}
                <div>
                  <h3 className="!bg-gray-100 !text-center !py-2 rounded-[10px] !text-sm !font-bold !text-gray-600 !mb-4">
                    Informações Adicionais
                  </h3>
                  <div className="!space-y-4">
                    <Field
                      label="Crédito"
                      value={`R$ ${linhaSelecionada["Crédito"]}`}
                    />

                    <Field
                      label="Observações"
                      value={linhaSelecionada.Observações || "-"}
                    />
                  </div>
                </div>
              </Drawer.Body>

              <Drawer.Footer className="!w-full !px-6 !py-4 !border-t flex flex-col gap-3 bg-white">
                <button
                  onClick={() => {
                    setIsDrawerOpen(false); // fecha o drawer
                    onClienteEditandoChange(linhaSelecionada); // abre o modal no ClientesPage
                  }}
                  className="!w-full flex items-center justify-center gap-2 !bg-blue-600 hover:!bg-blue-700 !text-white !font-semibold !py-3 !rounded-lg transition"
                >
                  <FaEdit className="!text-[20px]" />
                  Editar Informações
                </button>
                <a
                  href={`https://wa.me/send?phone=55${linhaSelecionada.Telefone.replace(
                    /\D/g,
                    ""
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="!no-underline !w-full flex items-center justify-center gap-2 !bg-green-500 hover:!bg-green-600 !text-white !font-semibold !py-3 !rounded-lg transition"
                >
                  <FaWhatsapp className="!text-[20px]" />
                  Enviar Mensagem
                </a>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Positioner>
        </Drawer.Root>
      )}
    </div>
  );
}
