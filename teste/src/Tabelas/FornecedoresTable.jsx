import React, { useEffect, useMemo, useState } from "react";
import CustomTable from "../components/CustomTable";
import debounce from "lodash.debounce";
import { Toaster, toaster } from "@/components/ui/toaster";
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

const filtrosIniciais = {
  status: [],
  tipo: [],
  dataInicial: null,
  dataFinal: null,
};

export default function FornecedoresTable({ fetchDataRef }) {
  const [fornecedores, setFornecedores] = useState([]);
  const [enableResizing, setEnableResizing] = useState(false);
  const [columnSizes, setColumnSizes] = useState({});
  const [filters, setFilters] = useState(filtrosIniciais);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [linhaSelecionada, setLinhaSelecionada] = useState(null);
  const [mostrarPopup, setMostrarPopup] = useState(false);

  const abrirPopupComDados = (linha) => {
    setLinhaSelecionada(linha);
    setMostrarPopup(true);
  };

  const debouncedSearchHandler = useCallback(
    debounce((value) => {
      setDebouncedSearch(value);
    }, 500),
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
    ],
    []
  );

  const [hiddenColumns, setHiddenColumns] = useState([
    "Email",
    "Inscricao Estadual",
    "Data de Cadastro",
    "Endereco",
    "Complemento",
    "Bairro",
    "CEP",
    "Credito",
    "Cidade",
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
          "Inscricao Estadual",
          "Data de Cadastro",
          "Endereco",
          "Complemento",
          "Bairro",
          "CEP",
          "Credito",
          "Cidade",
        ];
      } else if (width <= 1339) {
        newHiddenColumns = [
          "Email",
          "Inscricao Estadual",
          "Data de Cadastro",
          "CPF/CNPJ",
          "Endereco",
          "Complemento",
          "Bairro",
          "CEP",
          "Credito",
          "Cidade",
        ];
      } else if (width <= 1639) {
        newHiddenColumns = [
          "Email",
          "Inscricao Estadual",
          "Data de Cadastro",
          "Endereco",
          "Complemento",
          "Bairro",
          "CEP",
          "Credito",
          "Cidade",
        ];
      } else if (width <= 1920) {
        newHiddenColumns = [
          "Inscricao Estadual",
          "Data de Cadastro",
          "Endereco",
          "Complemento",
        ];
      } else {
        newHiddenColumns = [
          "Inscricao Estadual",
          "Data de Cadastro",
          "Endereco",
          "Complemento",
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

      if (filters.tipo.length > 0) {
        filters.tipo.forEach((tipo) => params.append("tipo", tipo));
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
        `http://localhost:5000/api/fornecedores?${params.toString()}`
      );
      const data = await response.json();
      console.log(data);
      const mappedData = data.data.map((fornecedor) => ({
        id: fornecedor.id,
        Nome: fornecedor.nome,
        "CPF/CNPJ": fornecedor.documento,
        status: fornecedor.status,
        Email: fornecedor.email,
        "Inscricao Estadual": fornecedor.inscricaoEstadual,
        "Data de Cadastro": formatarData(fornecedor.dataCadastro),
        dataCadastroRaw: fornecedor.dataCadastro,
        Endereço: fornecedor.endereco,
        Complemento: fornecedor.complemento,
        Bairro: fornecedor.bairro,
        CEP: fornecedor.cep,
        Cidade: fornecedor.cidade,
        Credito: fornecedor.limiteCredito,
      }));

      setFornecedores(mappedData);
      setTotalPaginas(data.totalPages);
      setTotalItens(data.total);
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
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
            className={`cursor-pointer filter-icon p-1 rounded-[4px] ${
              isSelected ? "bg-blue-200" : "bg-gray-100 hover:bg-gray-300"
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
              className="absolute top-9 w-60 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-4"
            >
              <h2 className="text-sm font-semibold mb-2">
                Filtrar por {config.label}
              </h2>
              <div className="flex flex-col gap-2 text-sm">
                {config.options.map((option) => (
                  <label key={option.value} className="flex items-center gap-2">
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
          className={`cursor-pointer filter-icon p-1 rounded-[4px] ${
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
            className="absolute top-9 w-72 bg-white border border-gray-200 rounded-md shadow-lg z-10 p-4"
          >
            <h2 className="text-sm font-semibold mb-2">
              Filtrar por intervalo
            </h2>
            <div className="flex flex-col gap-2 text-sm">
              <label>
                Data Inicial:
                <input
                  type="date"
                  className=" border px-2 py-1 rounded mt-1"
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
                  className=" border px-2 py-1 rounded mt-1"
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
    "tipo",
    "CPF/CNPJ",
    "Email",
    "Inscricao Estadual",
    "Data de Cadastro",
    "Endereco",
    "Complemento",
    "Bairro",
    "Cidade",
    "CEP",
    "Credito",
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

      // COLUNA STATUS
      {
        id: "status",
        accessorKey: "status",
        header: () => renderFilterHeader("status"),
        enableSorting: true,
        enableResizing: true,
        minSize: 200,
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
              onClick={() => abrirPopupComDados(row.original)}
            >
              <FiEye className=" text-black" title="Visualizar" />
            </div>

            <div className="cursor-pointer !bg-[#f7f7f7] hover:!bg-[#dcdcdc] !p-1 !rounded-lg">
              <FiMail className="text-black" />
            </div>

            <div className="cursor-pointer !bg-[#f7f7f7] hover:!bg-[#dcdcdc] !p-1 !rounded-lg">
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
        minSize: 150,
      },
      // COLUNA EMAIL
      {
        id: "Email",
        header: "Email",
        accessorKey: "Email",
        enableHiding: true,
        minSize: 300,
      },
      // COLUNA INSCRIÇÃO ESTADUAL
      {
        id: "Inscricao Estadual",
        header: "Inscricao Estadual",
        accessorKey: "Inscricao Estadual",
        enableHiding: true,
        minSize: 200,
      },
      // COLUNA DATA DE CADASTRO
      {
        id: "Data de Cadastro",
        header: renderDateRangeFilterHeader,
        accessorKey: "Data de Cadastro",
        enableHiding: true,
        minSize: 300,
      },
      // COLUNA ENDEREÇO
      {
        id: "Endereco",
        accessorKey: "Endereço",
        enableHiding: true,
        minSize: 300,
      },
      // COLUNA COMPLEMENTO
      {
        id: "Complemento",
        accessorKey: "Complemento",
        enableHiding: true,
        minSize: 300,
      },
      // COLUNA CIDADE
      {
        id: "Cidade",
        accessorKey: "Cidade",
        enableHiding: true,
        minSize: 300,
      },
      // COLUNA BAIRRO
      {
        id: "Bairro",
        accessorKey: "Bairro",
        enableHiding: true,
        minSize: 300,
      },
      // COLUNA CEP
      {
        id: "CEP",
        accessorKey: "CEP",
        enableHiding: true,
        minSize: 300,
      },
      // COLUNA CREDITO
      {
        id: "Credito",
        accessorKey: "Credito",
        enableHiding: true,
        minSize: 200,
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
        className="cursor-pointer rounded text-sm font-medium text-gray-400 hover:text-gray-600 flex items-center gap-2"
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
      "Tem certeza que deseja excluir este fornecedor?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/fornecedores/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        toaster.create({
          title: "Fornecedor excluído",
          description: "O Fornecedor foi removido com sucesso.",
          type: "success",
          duration: 3000,
        });
        fetchData();
      } else {
        throw new Error("Erro ao excluir o Fornecedor.");
      }
    } catch (error) {
      toaster.error(error.message || "Erro inesperado ao excluir Fornecedor.");
    }
  };

  useEffect(() => {
    if (fetchDataRef) {
      fetchDataRef.current = fetchData;
    }
  }, [fetchData, fetchDataRef]);

  return (
    <div>
      <CustomTable
        data={fornecedores}
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
      />

      <Toaster />

      {selectedRows.length > 0 && (
        <div className="fixed bottom-4 left-[50%] -translate-x-1/2 bg-white shadow-lg border border-gray-300 rounded-lg px-6 py-4 z-50 flex items-center gap-4 animate-fade-in">
          <span className="text-sm">
            {selectedRows.length} Fornecedor
            {selectedRows.length > 1 ? "es" : ""} selecionado
            {selectedRows.length > 1 ? "s" : ""}
          </span>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1.5 text-sm rounded"
            onClick={async () => {
              const confirm = window.confirm(
                `Tem certeza que deseja deletar ${selectedRows.length} Fornecedor(es)?`
              );
              if (!confirm) return;

              try {
                const ids = selectedRows.map((row) => row.id).join(",");
                const response = await fetch(
                  `http://localhost:5000/api/fornecedores/${ids}`,
                  {
                    method: "DELETE",
                  }
                );

                if (response.ok) {
                  toaster.create({
                    title: "Fornecedores deletados",
                    description: "Todos os selecionados foram removidos.",
                    type: "success",
                    duration: 3000,
                  });
                  fetchData(); // atualiza a lista
                  setSelectedRows([]); // limpa seleção
                } else {
                  throw new Error("Erro ao deletar fornecedores.");
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

      {mostrarPopup && linhaSelecionada && (
        <div
          className="fixed inset-0 z-[1000] flex justify-end"
          onClick={() => setMostrarPopup(false)}
        >
          <div
            className="bg-white w-full max-w-[300px] h-screen shadow-2xl flex flex-col relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botão Fechar */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition"
              onClick={() => setMostrarPopup(false)}
            >
              <IoClose size={24} />
            </button>

            {/* Cabeçalho */}
            <div className="px-6 pt-6 pb-4 border-b">
              <h2 className="text-2xl font-semibold text-gray-800">
                Detalhes do Fornecedor
              </h2>
            </div>

            {/* Conteúdo scrollável */}
            <div className="flex-grow overflow-y-auto pb-[100px] px-6 py-4 space-y-4 text-sm text-gray-700">
              <div className="flex items-center gap-2">
                <FaIdCard className="text-gray-500" />
                <span>
                  <strong>ID:</strong> {linhaSelecionada.id}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaUser className="text-gray-500" />
                <span>
                  <strong>Nome:</strong> {linhaSelecionada.Nome}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FaAddressCard className="text-gray-500" />
                <span>
                  <strong>CPF/CNPJ:</strong> {linhaSelecionada["CPF/CNPJ"]}
                </span>
              </div>
              <div>
                <strong>Tipo:</strong> {linhaSelecionada.tipo}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                    linhaSelecionada.status === "Ativo"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {linhaSelecionada.status}
                </span>
              </div>
              {linhaSelecionada.Email && (
                <div className="flex items-center gap-2">
                  <FaEnvelope className="text-gray-500" />
                  <span>
                    <strong>Email:</strong> {linhaSelecionada.Email}
                  </span>
                </div>
              )}
              {linhaSelecionada["Inscricao Estadual"] && (
                <div>
                  <strong>Inscrição Estadual:</strong>{" "}
                  {linhaSelecionada["Inscricao Estadual"]}
                </div>
              )}
              {linhaSelecionada["Data de Cadastro"] && (
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-gray-500" />
                  <span>
                    <strong>Data de Cadastro:</strong>{" "}
                    {linhaSelecionada["Data de Cadastro"]}
                  </span>
                </div>
              )}
              <div>
                <strong>Endereço:</strong> {linhaSelecionada.Endereço}
              </div>
              <div>
                <strong>Cidade:</strong> {linhaSelecionada.Cidade}
              </div>
              <div>
                <strong>CEP:</strong> {linhaSelecionada.CEP}
              </div>
              <div>
                <strong>Bairro:</strong> {linhaSelecionada.Bairro}
              </div>
              <div>
                <strong>Complemento:</strong> {linhaSelecionada.Complemento}
              </div>

              <div>
                <strong>Crédito:</strong> R$ {linhaSelecionada.Credito}
              </div>
            </div>

            {/* Rodapé fixo */}
            <div className="w-full px-6 py-4 border-t flex flex-col gap-3 bg-white">
              <button className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition">
                <FaEdit className="text-[20px]" />
                Editar Informações
              </button>
              <button className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-lg transition">
                <FaWhatsapp className="text-[20px]" />
                Enviar Mensagem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
