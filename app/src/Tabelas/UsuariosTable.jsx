import React, { useEffect, useMemo, useRef, useState } from "react";
import CustomTable from "../components/CustomTable";
import debounce from "lodash.debounce";
import { Toaster, toaster } from "@/components/ui/toaster";
import { FaUserCircle } from "react-icons/fa";
import { BsClipboardFill } from "react-icons/bs";
import { FaPhone, FaUserTie } from "react-icons/fa6";

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
  Nivel: [],
  dataInicial: null,
  dataFinal: null,
};

export default function UsuariosTable({
  fetchDataRef,
  onUsuarioEditandoChange,
}) {
  const [usuarioEditando, setUsuarioEditando] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [enableResizing, setEnableResizing] = useState(false);
  const [columnSizes, setColumnSizes] = useState({});
  const [filters, setFilters] = useState(filtrosIniciais);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [linhaSelecionada, setLinhaSelecionada] = useState(null);
  const [selectionResetKey, setSelectionResetKey] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const loggedUserId = document.querySelector(".id-user")?.textContent;

  useEffect(() => {
    console.log(selectedRows);
  }, [selectedRows]);

  const abrirDrawerComDados = (linha) => {
    console.log(linha);
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
        key: "Nivel",
        label: "Nivel",
        options: [
          { value: "Padrão", label: "Padrão" },
          { value: "Admin", label: "Admin" },
          { value: "Vendedor", label: "Vendedor" },
        ],
      },
    ],
    []
  );

  const [hiddenColumns, setHiddenColumns] = useState([
    "Email",
    "Telefone",
    "Data de Cadastro",
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
          "Data de Cadastro",
          "Observações",
        ];
      } else if (width <= 1339) {
        newHiddenColumns = ["Telefone", "Data de Cadastro", "Observações"];
      } else if (width <= 1639) {
        newHiddenColumns = ["Data de Cadastro", "Observações"];
      } else if (width <= 1920) {
        newHiddenColumns = ["Data de Cadastro", "Observações"];
      } else {
        newHiddenColumns = ["Data de Cadastro", "Observações"];
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

      if (filters.Nivel.length > 0) {
        filters.Nivel.forEach((nivel) => params.append("nivel", nivel));
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
        `http://localhost:5000/api/usuarios?${params.toString()}`
      );
      const data = await response.json();
      const mappedData = data.data.map((usuario) => ({
        id: usuario.id,
        Nome: usuario.name,
        Nivel: usuario.nivel,
        Email: usuario.email,
        Telefone: usuario.telefone,
        Senha: usuario.password,
        FotoPerfil: usuario.fotoPerfil,
        "Data de Cadastro": formatarData(usuario.createdAt),
      }));

      setUsuarios(mappedData);
      setTotalPaginas(data.totalPages);
      setTotalItens(data.total);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
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
    "Nivel",
    "Email",
    "Telefone",
    "Data de Cadastro",
    "Observações",
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
      // COLUNA NIVEL
      {
        id: "Nivel",
        accessorKey: "Nivel",
        header: () => renderFilterHeader("Nivel"),
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

      // COLUNA AÇÕES
      {
        id: "Ações",
        accessorKey: "Ações",
        header: "Ações",
        cell: ({ row }) => {
          const isOwnUser = row.original.id === loggedUserId;

          return (
            <div className="flex gap-1 !text-[19px]">
              <div
                className="cursor-pointer !bg-[#f7f7f7] hover:!bg-[#dcdcdc] !p-1 !rounded-lg"
                onClick={() => abrirDrawerComDados(row.original)}
              >
                <FiEye className=" text-black" title="Visualizar" />
              </div>

              <div
                className="cursor-pointer !bg-[#f7f7f7] hover:!bg-[#dcdcdc] !p-1 !rounded-lg"
                onClick={() => handleSetUsuarioEditando(row.original)}
              >
                <FiEdit className="text-orange-500" />
              </div>

              {isOwnUser ? (
                <Badge className="!rounded-full !bg-gray-300 !text-gray-600 !px-4">
                  Você
                </Badge>
              ) : (
                <div className="cursor-pointer !bg-[#f7f7f7] hover:!bg-[#dcdcdc] !p-1 !rounded-lg">
                  <FiTrash2
                    className="text-red-500"
                    onClick={() => handleDelete(row.original.id)}
                  />
                </div>
              )}
            </div>
          );
        },

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

      // COLUNA DATA DE CADASTRO
      {
        id: "Data de Cadastro",
        header: renderDateRangeFilterHeader,
        accessorKey: "Data de Cadastro",
        enableHiding: true,
        size: 200,
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

  const handleDelete = async (id, isOwnUser = false) => {
    const confirmDelete = window.confirm(
      isOwnUser
        ? "Tem certeza que deseja excluir este usuário? Ao excluir, você será desconectado automaticamente."
        : "Tem certeza que deseja excluir este usuário?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/usuarios/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toaster.create({
          title: "Usuário excluído",
          description: "O usuário foi removido com sucesso.",
          type: "success",
          duration: 3000,
        });
        fetchData();

        // SE EXCLUIR O PRÓPRIO USUÁRIO
        if (isOwnUser) {
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
        }
      } else {
        throw new Error("Erro ao excluir o usuário.");
      }
    } catch (error) {
      toaster.error(error.message || "Erro inesperado ao excluir usuário.");
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

  const handleSetUsuarioEditando = (usuario) => {
    setUsuarioEditando(usuario);
    if (onUsuarioEditandoChange) onUsuarioEditandoChange(usuario);
  };

  return (
    <div>
      <CustomTable
        data={usuarios}
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
            {selectedRows.length} usuário
            {selectedRows.length > 1 ? "s" : ""} selecionado
            {selectedRows.length > 1 ? "s" : ""}
          </span>
          <button
            className="!bg-red-500 hover:!bg-red-600 !text-white !px-4 !py-1.5 !text-sm !rounded"
            onClick={async () => {
              const confirm = window.confirm(
                `Tem certeza que deseja deletar ${selectedRows.length} usuário(s)?`
              );
              if (!confirm) return;

              try {
                const ids = selectedRows.map((row) => row.id).join(",");
                const isDeletingOwnUser = ids.includes(loggedUserId);

                const response = await fetch(
                  `http://localhost:5000/api/usuarios/${ids}`,
                  {
                    method: "DELETE",
                  }
                );

                if (response.ok) {
                  toaster.create({
                    title: "Usuários deletados",
                    description: "Todos os selecionados foram removidos.",
                    type: "success",
                    duration: 3000,
                  });
                  fetchData(); // atualiza a lista
                  setSelectedRows([]);
                  setSelectionResetKey((prev) => prev + 1);

                  if (isDeletingOwnUser) {
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
                      return; // evita execução do restante após redirecionamento
                    } else {
                      throw new Error("Erro ao fazer logout");
                    }
                  }
                } else {
                  throw new Error("Erro ao deletar usuários.");
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
                  <FaUserTie /> Usuário
                </h2>
              </Drawer.Header>

              <Drawer.Body className="!flex-grow !overflow-y-auto !pb-[70px] !px-6 !py-4 !space-y-6 !text-sm !text-gray-700">
                {/* Nome no topo com destaque */}

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
                      label="Nivel"
                      value={linhaSelecionada.Nivel}
                      icon={<BsClipboardFill />}
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

                    {linhaSelecionada["Data de Cadastro"] && (
                      <Field
                        icon={<FaCalendarAlt className="text-gray-500" />}
                        label="Data de Cadastro"
                        value={linhaSelecionada["Data de Cadastro"]}
                      />
                    )}
                  </div>
                </div>
              </Drawer.Body>

              <Drawer.Footer className="!w-full !px-6 !py-4 !border-t flex flex-col gap-3 bg-white">
                <button
                  onClick={() => {
                    setIsDrawerOpen(false); // fecha o drawer
                    onUsuarioEditandoChange(linhaSelecionada); // abre o modal no UsuariosPage
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
