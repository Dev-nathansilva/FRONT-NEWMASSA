"use client";

import {
  Box,
  Stack,
  Heading,
  SimpleGrid,
  Field,
  Input,
  InputGroup,
  NativeSelect,
  Switch,
  Badge,
  Span,
  Flex,
  Button,
  Table,
  Select,
  List,
  Text,
  IconButton,
  Tabs,
} from "@chakra-ui/react";
import { format } from "date-fns";
import ptBR from "rsuite/locales/pt_BR";
import { CustomProvider } from "rsuite";

import { DatePicker } from "rsuite";
import debounce from "lodash.debounce";
import { Spinner } from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import { withMask } from "use-mask-input";
import { HiCheck, HiTrash, HiX } from "react-icons/hi";
import { NumericFormat } from "react-number-format";
import { useEffect, useState } from "react";
import { FaTrashCan } from "react-icons/fa6";
import { BsPlusCircleFill, BsSortNumericDown } from "react-icons/bs";

import {
  MdInfo,
  MdAttachMoney,
  MdViewModule,
  MdLocalShipping,
} from "react-icons/md";
import { LuTriangleAlert } from "react-icons/lu";
import { IoClose, IoSearch } from "react-icons/io5";
import { toaster } from "../ui/toaster";
import { useWatch, useFieldArray } from "react-hook-form";
import { useRef } from "react";

export default function ProdutoModal({
  register,
  control,
  errors,
  setValue,
  watch,
}) {
  // -------------------------------------
  // COMPOSIÇÕES
  // -------------------------------------

  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [buscaFinalizada, setBuscaFinalizada] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [mostrarResultadosFornecedores, setMostrarResultadosFornecedores] =
    useState(false);
  const idProdutoEditando = watch("id");
  const {
    fields: composicoesFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "composicoes",
  });

  useEffect(() => {
    console.log("produtoSelecionado", produtoSelecionado);
  }, [produtoSelecionado]);

  const blocoPesquisaComponenteRef = useRef();
  const blocoPesquisaFornecedorRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        blocoPesquisaComponenteRef.current &&
        !blocoPesquisaComponenteRef.current.contains(event.target)
      ) {
        setMostrarResultados(false);
      }

      if (
        blocoPesquisaFornecedorRef.current &&
        !blocoPesquisaFornecedorRef.current.contains(event.target)
      ) {
        setMostrarResultadosFornecedores(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const buscarProdutos = async (termo = "") => {
    const params = new URLSearchParams({
      search: termo,
      status: "true",
      limit: "10",
    });

    setIsLoading(true);
    setBuscaFinalizada(false);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/produtos?${params.toString()}`
      );
      const data = await res.json();

      const todosProdutos = Array.isArray(data.data) ? data.data : [];
      const produtosFiltrados = todosProdutos.filter(
        (p) => p.id !== idProdutoEditando
      );

      setProdutos(produtosFiltrados);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    } finally {
      setIsLoading(false);
      setBuscaFinalizada(true);
    }
  };

  useEffect(() => {
    const debouncedFetch = debounce(() => {
      if (busca.trim()) {
        buscarProdutos(busca);
      }
    }, 400);

    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [busca]);

  const adicionarComponente = () => {
    if (!produtoSelecionado) {
      toaster.create({
        description: "Selecione um Produto",
        type: "warning",
        duration: 1500,
      });
      return;
    }

    if (!quantidade || quantidade <= 0) {
      toaster.create({
        description: "Adicione uma Quantidade Necessária",
        type: "warning",
        duration: 1500,
      });
      return;
    }

    const jaExiste = composicoesFields.some(
      (c) => c.componente.id === produtoSelecionado.id
    );
    if (jaExiste) {
      toaster.create({
        description: "Componente já está na lista",
        type: "warning",
        duration: 1500,
      });
      return;
    }

    append({
      componente: {
        id: produtoSelecionado.id,
        descricao: produtoSelecionado.descricao,
        estoque: produtoSelecionado.estoque,
      },
      quantidade: Number(quantidade),
    });

    setProdutoSelecionado(null);
    setBusca("");
    setQuantidade("");
  };

  // -------------------------------------
  // FORNECEDORES
  // -------------------------------------

  const [fornecedores, setFornecedores] = useState([]);
  const [buscaFornecedor, setBuscaFornecedor] = useState("");
  const [fornecedorLoading, setFornecedorLoading] = useState(false);
  const [buscaFornecedorFinalizada, setBuscaFornecedorFinalizada] =
    useState(false);

  const {
    fields: fornecedoresFields,
    append: appendFornecedor,
    remove: removeFornecedor,
  } = useFieldArray({
    control,
    name: "fornecedores",
  });

  const buscarFornecedores = async (termo = "") => {
    const params = new URLSearchParams({
      search: termo,
      limit: "10",
    });

    setFornecedorLoading(true);
    setBuscaFornecedorFinalizada(false);

    try {
      const res = await fetch(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/api/fornecedores?${params.toString()}`
      );

      const data = await res.json();

      setFornecedores(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
    } finally {
      setFornecedorLoading(false);
      setBuscaFornecedorFinalizada(true);
    }
  };

  useEffect(() => {
    const debouncedFetch = debounce(() => {
      if (buscaFornecedor.trim()) {
        buscarFornecedores(buscaFornecedor);
      }
    }, 400);

    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [buscaFornecedor]);

  const adicionarFornecedor = (fornecedor) => {
    const jaExiste = fornecedoresFields.some(
      (item) => item.fornecedor.id === fornecedor.id
    );

    if (jaExiste) {
      toaster.create({
        title: "Fornecedor já adicionado",
        type: "warning",
        duration: 3000,
      });
      return;
    }

    appendFornecedor({
      fornecedor: {
        id: fornecedor.id,
        nome: fornecedor.nome,
        documento: fornecedor.documento,
      },
    });
    setBuscaFornecedor("");
  };

  const camposPorAba = {
    caracteristicas: [
      "descricao",
      "unidade",
      "formato",
      "codigoSKU",
      "estoque",
      "precoCusto",
      "precoVenda",
      "margemLucro",
      "codigoBarrasGTIN",
      "observacoes",
      "status",
    ],
    tributacao: [
      "ncm",
      "cest",
      "csosn",
      "cstPis",
      "cstCofins",
      "origem",
      "icmsInterno",
      "baseCalculo",
      "ipi",
    ],
  };

  const temErroNaAba = (aba) => {
    const campos = camposPorAba[aba] || [];
    return campos.some((campo) => !!errors[campo]);
  };

  const formato = watch("formato");
  const isComponente = formato === "Componente";

  useEffect(() => {
    if (formato === "Componente" && composicoesFields.length > 0) {
      remove();
    }
  }, [formato]);

  return (
    <form id="formProduto">
      <Tabs.Root
        defaultValue="caracteristicas"
        variant="unstyled"
        activationMode="manual"
      >
        <Tabs.List
          style={{
            display: "flex",
            gap: "8px",
          }}
        >
          <Tabs.Trigger
            value="caracteristicas"
            _selected={{ bg: "blue.600", color: "white" }}
            className={`abas-modal ${
              temErroNaAba("caracteristicas")
                ? "!border-red-500 !border-2 !rounded-md"
                : ""
            }`}
          >
            <MdInfo className="text-lg" />
            Características
          </Tabs.Trigger>

          <Tabs.Trigger
            value="tributacao"
            _selected={{ bg: "blue.600", color: "white" }}
            className={`abas-modal ${
              temErroNaAba("tributacao")
                ? "!border-red-500 !border-2 !rounded-md"
                : ""
            }`}
          >
            <MdAttachMoney className="text-lg" />
            Tributação
          </Tabs.Trigger>

          <Tabs.Trigger
            value="composicao"
            disabled={isComponente}
            _selected={{ bg: "blue.600", color: "white" }}
            className={`abas-modal`}
          >
            <MdViewModule className="text-lg" />
            Composição
          </Tabs.Trigger>

          <Tabs.Trigger
            value="fornecedores"
            _selected={{ bg: "blue.600", color: "white" }}
            className={`abas-modal`}
          >
            <MdLocalShipping className="text-lg" />
            Fornecedores
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="caracteristicas">
          <Box className="!mt-3">
            <Heading
              fontSize="md"
              mb={4}
              className="w-full !bg-gray-100 rounded-[5px] !pl-3 !border"
            >
              Características
            </Heading>
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              className="gap-x-7 gap-y-5 !px-3"
            >
              {/* DESCRIÇÃO */}
              <Field.Root required invalid={!!errors.descricao}>
                <Field.Label>
                  Descrição <Field.RequiredIndicator />{" "}
                </Field.Label>
                <Controller
                  name="descricao"
                  control={control}
                  rules={{
                    required: "Descrição é obrigatório",
                    maxLength: {
                      value: 50,
                      message: "Limite máximo de 50 caracteres",
                    },
                  }}
                  render={({ field }) => {
                    const length = (field.value || "").length;
                    return (
                      <InputGroup
                        endElement={
                          <Span
                            color={length > 50 ? "danger" : "fg.muted"}
                            textStyle="xs"
                          >
                            {length} / 50
                          </Span>
                        }
                      >
                        <Input
                          {...field}
                          maxLength={50}
                          placeholder="Descrição do produto..."
                          value={field.value || ""}
                          className="!pr-17"
                        />
                      </InputGroup>
                    );
                  }}
                />

                <Field.ErrorText>{errors.nome?.message}</Field.ErrorText>
              </Field.Root>

              {/* UNIDADE */}
              <Controller
                name="unidade"
                control={control}
                rules={{ required: "Selecione um item da lista" }}
                render={({ field }) => (
                  <Field.Root required invalid={!!errors.unidade}>
                    <Field.Label>
                      Unidade <Field.RequiredIndicator />
                    </Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      >
                        <option value="">Selecione a Unidade</option>
                        <option value="Un">Un</option>
                        <option value="Kg">Kg</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    <Field.ErrorText>{errors.unidade?.message}</Field.ErrorText>
                  </Field.Root>
                )}
              />

              {/* FORMATO */}
              <Controller
                name="formato"
                control={control}
                rules={{ required: "Selecione um item da lista" }}
                render={({ field }) => (
                  <Field.Root required invalid={!!errors.formato}>
                    <Field.Label>
                      Formato <Field.RequiredIndicator />
                    </Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      >
                        <option value="">Escolha um Formato</option>
                        <option value="Produto Final">Produto Final</option>
                        <option value="Componente">Componente</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    <Field.ErrorText>{errors.formato?.message}</Field.ErrorText>
                  </Field.Root>
                )}
              />

              {/* CÓDIGO SKU */}
              <Field.Root>
                <Field.Label>
                  Código ( SKU ){" "}
                  <Field.RequiredIndicator
                    fallback={
                      <Badge size="xs" variant="surface">
                        Opcional
                      </Badge>
                    }
                  />
                </Field.Label>
                <Input
                  placeholder="Ex: SKU12345 ou PROD-001"
                  {...register("codigoSKU")}
                />
              </Field.Root>

              {/* ESTOQUE */}
              <Field.Root>
                <Field.Label>Estoque </Field.Label>
                <Input
                  type="number"
                  placeholder="Estoque"
                  {...register("estoque")}
                />
              </Field.Root>

              <Box>
                <CustomProvider locale={ptBR}>
                  {/* DATA DE VALIDADE */}
                  <Field.Root>
                    <Field.Label>Data de validade</Field.Label>
                    <Controller
                      name="dataValidade"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          value={field.value ? new Date(field.value) : null}
                          onChange={(date) => field.onChange(date)}
                          format="dd/MM/yyyy"
                          placeholder="Selecione a data"
                          oneTap
                          placement="autoVerticalEnd"
                          style={{
                            width: "100%",
                          }}
                        />
                      )}
                    />
                  </Field.Root>
                </CustomProvider>
              </Box>

              {/* PREÇO DE CUSTO */}
              <Field.Root>
                <Field.Label>Preço de Custo</Field.Label>
                <InputGroup startAddon="R$" endAddon="BRL">
                  <Controller
                    name="precoCusto"
                    control={control}
                    defaultValue={""}
                    render={({ field }) => (
                      <NumericFormat
                        {...field}
                        customInput={Input}
                        thousandSeparator="."
                        decimalSeparator=","
                        decimalScale={2}
                        fixedDecimalScale
                        allowNegative={false}
                        placeholder="0,00"
                        value={field.value ?? 0}
                        onValueChange={(values) => {
                          field.onChange(values.floatValue ?? 0);
                        }}
                      />
                    )}
                  />
                </InputGroup>
              </Field.Root>

              {/* PREÇO DE VENDA */}
              <Field.Root>
                <Field.Label>Preço de Venda</Field.Label>
                <InputGroup startAddon="R$" endAddon="BRL">
                  <Controller
                    name="precoVenda"
                    control={control}
                    defaultValue={""}
                    render={({ field }) => (
                      <NumericFormat
                        {...field}
                        customInput={Input}
                        thousandSeparator="."
                        decimalSeparator=","
                        decimalScale={2}
                        fixedDecimalScale
                        allowNegative={false}
                        placeholder="0,00"
                        value={field.value ?? 0}
                        onValueChange={(values) => {
                          field.onChange(values.floatValue ?? 0);
                        }}
                      />
                    )}
                  />
                </InputGroup>
              </Field.Root>

              {/* MARGEM DE LUCRO */}
              <Field.Root invalid={!!errors.comissao}>
                <Field.Label>Margem de Lucro</Field.Label>
                <InputGroup startAddon="%">
                  <Controller
                    name="margemLucro"
                    control={control}
                    defaultValue={""}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        step="0.25"
                        placeholder="0,00"
                        value={field.value ?? 0}
                      />
                    )}
                  />
                </InputGroup>
                <Field.ErrorText>{errors.comissao?.message}</Field.ErrorText>
              </Field.Root>

              {/* CÓDIGO DE BARRAS GTIN */}
              <Field.Root>
                <Field.Label>Código de Barras (GTIN)</Field.Label>
                <Input
                  placeholder="Código de Barras GTIN"
                  {...register("codigoBarrasGTIN")}
                />
              </Field.Root>

              <Field.Root invalid={!!errors.observacoes}>
                <Field.Label>Observações</Field.Label>
                <Controller
                  name="observacoes"
                  control={control}
                  rules={{
                    maxLength: {
                      value: 200,
                      message: "Limite máximo de 200 caracteres",
                    },
                  }}
                  render={({ field }) => {
                    const length = (field.value || "").length;
                    return (
                      <InputGroup
                        endElement={
                          <Span
                            color={length > 200 ? "danger" : "fg.muted"}
                            textStyle="xs"
                          >
                            {length} / 200
                          </Span>
                        }
                      >
                        <Input
                          {...field}
                          maxLength={200} // impede digitar mais que 200
                          value={field.value || ""}
                          placeholder="Observações..."
                          className="!pr-17"
                        />
                      </InputGroup>
                    );
                  }}
                />
                <Field.ErrorText>{errors.observacoes?.message}</Field.ErrorText>
              </Field.Root>

              {/* STATUS */}
              <Field.Root
                orientation="horizontal"
                className="!flex !justify-start !w-[210px] !p-2 !mt-3  !border !border-gray-200 rounded-full"
              >
                <Field.Label>Status</Field.Label>
                <Controller
                  name="status"
                  control={control}
                  defaultValue={true}
                  render={({ field: { value, onChange } }) => (
                    <Switch.Root
                      size="lg"
                      checked={value}
                      onCheckedChange={(e) => onChange(e.checked)}
                    >
                      <Switch.HiddenInput />
                      <Switch.Control>
                        <Switch.Thumb>
                          <Switch.ThumbIndicator
                            fallback={<HiX color="black" />}
                          >
                            <HiCheck />
                          </Switch.ThumbIndicator>
                        </Switch.Thumb>
                      </Switch.Control>
                      <Switch.Label>{value ? "Ativo" : "Inativo"}</Switch.Label>
                    </Switch.Root>
                  )}
                />
              </Field.Root>
            </SimpleGrid>
          </Box>
        </Tabs.Content>

        <Tabs.Content value="tributacao">
          <Box className="!mt-3">
            <Heading
              fontSize="md"
              mb={4}
              className="w-full !bg-gray-100 rounded-[5px] !pl-3"
            >
              Tributação
            </Heading>
            <SimpleGrid
              columns={{ base: 1, md: 3 }}
              className="gap-x-7 gap-y-5 !px-3"
            >
              {/* ORIGEM */}
              <Controller
                name="origem"
                control={control}
                render={({ field }) => (
                  <Field.Root required invalid={!!errors.origem}>
                    <Field.Label>Origem</Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field {...field}>
                        <option value="">Selecione</option>
                        <option value="0">0 - Nacional</option>
                        <option value="1">
                          1 - Estrangeira - Importação direta
                        </option>
                        <option value="2">
                          2 - Estrangeira - Adquirida no mercado interno
                        </option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    <Field.ErrorText>{errors.origem?.message}</Field.ErrorText>
                  </Field.Root>
                )}
              />

              {/* NCM */}
              <Field.Root>
                <Field.Label>NCM</Field.Label>
                <Input placeholder="Código NCM" {...register("ncm")} />
              </Field.Root>

              {/* CEST */}
              <Field.Root>
                <Field.Label>CEST</Field.Label>
                <Input placeholder="Código CEST" {...register("cest")} />
              </Field.Root>

              {/* CSOSN */}
              <Field.Root>
                <Field.Label>CSOSN</Field.Label>
                <Input placeholder="CSOSN" {...register("csosn")} />
              </Field.Root>

              {/* ICMS INTERNO */}
              <Field.Root invalid={!!errors.icmsInterno}>
                <Field.Label>ICMS Interno</Field.Label>
                <InputGroup startAddon="%">
                  <Controller
                    name="icmsInterno"
                    control={control}
                    defaultValue={""}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        step="0.25"
                        placeholder="0,00"
                        value={field.value ?? 0}
                      />
                    )}
                  />
                </InputGroup>
                <Field.ErrorText>{errors.icmsInterno?.message}</Field.ErrorText>
              </Field.Root>

              {/* BASE DE CÁLCULO */}
              <Field.Root invalid={!!errors.baseCalculo}>
                <Field.Label>Base de Cálculo (%)</Field.Label>
                <InputGroup startAddon="%">
                  <Controller
                    name="baseCalculo"
                    control={control}
                    defaultValue={""}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        step="0.25"
                        placeholder="0,00"
                        value={field.value ?? 0}
                      />
                    )}
                  />
                </InputGroup>
                <Field.ErrorText>{errors.baseCalculo?.message}</Field.ErrorText>
              </Field.Root>

              {/* IPI */}
              <Field.Root invalid={!!errors.ipi}>
                <Field.Label>IPI</Field.Label>
                <InputGroup startAddon="%">
                  <Controller
                    name="ipi"
                    control={control}
                    defaultValue={""}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="number"
                        step="0.25"
                        placeholder="0,00"
                        value={field.value ?? 0}
                      />
                    )}
                  />
                </InputGroup>
                <Field.ErrorText>{errors.ipi?.message}</Field.ErrorText>
              </Field.Root>

              {/* CST PIS */}
              <Field.Root>
                <Field.Label>CST PIS</Field.Label>
                <Input placeholder="CST PIS" {...register("cstPis")} />
              </Field.Root>

              {/* CST COFINS */}
              <Field.Root>
                <Field.Label>CST COFINS</Field.Label>
                <Input placeholder="CST COFINS" {...register("cstCofins")} />
              </Field.Root>

              {/* PESO BRUTO */}
              <Field.Root>
                <Field.Label>Peso Bruto (kg)</Field.Label>
                <Controller
                  name="pesoBruto"
                  control={control}
                  render={({ field }) => (
                    <NumericFormat
                      {...field}
                      customInput={Input}
                      decimalScale={3}
                      fixedDecimalScale
                      allowNegative={false}
                      decimalSeparator=","
                      thousandSeparator="."
                      placeholder="0,000"
                      onValueChange={(values) => {
                        field.onChange(values.floatValue ?? 0);
                      }}
                    />
                  )}
                />
              </Field.Root>

              {/* PESO LÍQUIDO */}
              <Field.Root>
                <Field.Label>Peso Líquido (kg)</Field.Label>
                <Controller
                  name="pesoLiquido"
                  control={control}
                  render={({ field }) => (
                    <NumericFormat
                      {...field}
                      customInput={Input}
                      decimalScale={3}
                      fixedDecimalScale
                      allowNegative={false}
                      decimalSeparator=","
                      thousandSeparator="."
                      placeholder="0,000"
                      onValueChange={(values) => {
                        field.onChange(values.floatValue ?? 0);
                      }}
                    />
                  )}
                />
              </Field.Root>
            </SimpleGrid>
          </Box>
        </Tabs.Content>

        <Tabs.Content value="composicao">
          <Box className="!mt-3">
            <Heading
              fontSize="md"
              mb={4}
              className="w-full !bg-gray-100 rounded-[5px] !pl-3"
            >
              Composição
            </Heading>

            <Stack spacing={4} className="!px-3">
              <SimpleGrid
                columns={{ base: 1, md: 3 }}
                spacing={4}
                className="flex items-end gap-x-7 gap-y-5"
              >
                <Box position="relative" ref={blocoPesquisaComponenteRef}>
                  <Field.Root>
                    <Field.Label>Pesquisa</Field.Label>
                    <InputGroup
                      endAddon={
                        produtoSelecionado ? (
                          <button
                            onClick={() => {
                              setProdutoSelecionado(null);
                              setBusca("");
                              buscarProdutos();
                              setMostrarResultados(true);
                            }}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <IoClose className="!text-[17px] !text-gray-500 hover:!text-gray-700" />
                          </button>
                        ) : (
                          <IoSearch className="!text-[17px] !text-gray-500 hover:!text-gray-700" />
                        )
                      }
                    >
                      <Input
                        placeholder="Buscar por componentes..."
                        value={busca}
                        onFocus={() => {
                          buscarProdutos(); // busca inicial
                          setMostrarResultados(true);
                        }}
                        className="relative"
                        onChange={(e) => {
                          setBusca(e.target.value);
                          setProdutoSelecionado(null);
                          setMostrarResultados(true);

                          if (e.target.value.trim() === "") {
                            buscarProdutos();
                          }
                        }}
                        pr={isLoading ? "2.5rem" : undefined}
                      />
                    </InputGroup>
                  </Field.Root>

                  {mostrarResultados &&
                    !produtoSelecionado &&
                    produtos.length > 0 && (
                      <List.Root
                        position="absolute"
                        top="100%"
                        left="0"
                        right="0"
                        bg="white"
                        border="1px solid #ccc"
                        zIndex="10"
                        maxH="200px"
                        overflowY="auto"
                      >
                        {produtos.map((produto) => (
                          <List.Item
                            key={produto.id}
                            px={3}
                            py={2}
                            cursor="pointer"
                            _hover={{ bg: "gray.100" }}
                            onClick={() => {
                              setProdutoSelecionado(produto);
                              setBusca(produto.descricao);
                              setMostrarResultados(false);
                            }}
                          >
                            {produto.descricao}
                          </List.Item>
                        ))}
                      </List.Root>
                    )}
                  {mostrarResultados &&
                    !produtoSelecionado &&
                    !isLoading &&
                    buscaFinalizada &&
                    produtos.length === 0 && (
                      <Box
                        position="absolute"
                        top="100%"
                        left="0"
                        right="0"
                        bg="white"
                        border="1px solid #ccc"
                        zIndex="10"
                        px={3}
                        py={2}
                      >
                        <Text>Nenhum resultado encontrado</Text>
                      </Box>
                    )}
                </Box>

                <Field.Root>
                  <Field.Label>Quantidade </Field.Label>
                  <Input
                    type="number"
                    min={0}
                    placeholder="Quantidade"
                    value={quantidade || ""}
                    onChange={(e) => setQuantidade(e.target.value)}
                  />
                </Field.Root>

                <Button
                  className="font-bold !text-white max-w-32 !rounded-[6px]"
                  colorPalette="green"
                  onClick={adicionarComponente}
                >
                  <BsPlusCircleFill />
                  Adicionar
                </Button>
              </SimpleGrid>

              <Box
                border="1px solid #e2e8f0"
                borderRadius="md"
                overflow="hidden"
                boxShadow="sm"
                className="w-[78%] !mt-5"
              >
                <Table.Root width="100%" tableLayout="fixed">
                  <Table.Header bg="gray.100">
                    <Table.Row>
                      <Table.ColumnHeader
                        py={3}
                        px={4}
                        fontWeight="bold"
                        w="15%"
                      >
                        Id
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        py={3}
                        px={4}
                        fontWeight="bold"
                        w="40%"
                      >
                        Descrição
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        py={3}
                        px={4}
                        fontWeight="bold"
                        w="15%"
                      >
                        Qtd
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        py={3}
                        px={4}
                        fontWeight="bold"
                        w="15%"
                      >
                        Estoque
                      </Table.ColumnHeader>
                      <Table.ColumnHeader
                        py={3}
                        px={4}
                        fontWeight="bold"
                        w="15%"
                      >
                        Ações
                      </Table.ColumnHeader>
                    </Table.Row>
                  </Table.Header>

                  <Table.Body>
                    {composicoesFields.length === 0 ? (
                      <Table.Row>
                        <Table.Cell
                          colSpan={5}
                          py={4}
                          textAlign="center"
                          className="!text-gray-400"
                        >
                          <LuTriangleAlert className="!inline-block !mr-2 !mt-[-2px]" />
                          Nenhum componente cadastrado
                        </Table.Cell>
                      </Table.Row>
                    ) : (
                      composicoesFields.map((comp, index) => (
                        <Table.Row
                          key={comp.id}
                          bg={index % 2 === 0 ? "white" : "gray.50"}
                          _hover={{ bg: "gray.100" }}
                        >
                          <Table.Cell py={3} px={4} w="15%">
                            {comp.componente.id}
                          </Table.Cell>
                          <Table.Cell py={3} px={4} w="40%">
                            {comp.componente.descricao}
                          </Table.Cell>
                          <Table.Cell py={3} px={4} w="15%">
                            <Input
                              type="number"
                              min={0}
                              {...register(`composicoes.${index}.quantidade`, {
                                valueAsNumber: true,
                              })}
                              className="!w-20"
                            />
                          </Table.Cell>
                          <Table.Cell py={3} px={4} w="15%">
                            {comp.componente.estoque}
                          </Table.Cell>
                          <Table.Cell py={3} px={4} w="15%">
                            <IconButton
                              aria-label="Remover"
                              onClick={() => remove(index)}
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              _hover={{ bg: "red.50", color: "red.500" }}
                            >
                              <FaTrashCan />
                            </IconButton>
                          </Table.Cell>
                        </Table.Row>
                      ))
                    )}
                  </Table.Body>
                </Table.Root>
              </Box>
            </Stack>
          </Box>
        </Tabs.Content>

        <Tabs.Content value="fornecedores">
          <Box className="!mt-3">
            <Heading
              fontSize="md"
              mb={4}
              className="w-full !bg-gray-100 rounded-[5px] !pl-3"
            >
              Fornecedores
            </Heading>
            <Box
              position="relative"
              className="max-w-2xl"
              ref={blocoPesquisaFornecedorRef}
            >
              <Field.Root>
                <Field.Label>Pesquisa</Field.Label>
                <InputGroup endAddon={<IoSearch />}>
                  <Input
                    placeholder="Buscar fornecedor..."
                    value={buscaFornecedor}
                    className="relative"
                    onFocus={() => {
                      buscarFornecedores();
                      setMostrarResultadosFornecedores(true);
                    }}
                    onChange={(e) => {
                      setBuscaFornecedor(e.target.value);
                      setMostrarResultadosFornecedores(true);

                      if (e.target.value.trim() === "") {
                        buscarFornecedores();
                      }
                    }}
                  />
                </InputGroup>
              </Field.Root>

              {mostrarResultadosFornecedores &&
                !fornecedorLoading &&
                buscaFornecedorFinalizada && (
                  <List.Root
                    position="absolute"
                    top="100%"
                    left="0"
                    right="0"
                    bg="white"
                    border="1px solid #ccc"
                    zIndex="10"
                    maxH="200px"
                    overflowY="auto"
                  >
                    {fornecedores.length > 0 ? (
                      fornecedores.map((fornecedor) => (
                        <List.Item
                          key={fornecedor.id}
                          px={3}
                          py={2}
                          cursor="pointer"
                          _hover={{ bg: "gray.100" }}
                          className="!text-black !flex !justify-between !items-center"
                          onClick={() => {
                            adicionarFornecedor(fornecedor);
                            setMostrarResultadosFornecedores(false);
                          }}
                        >
                          <Box>
                            <Text fontWeight="bold">{fornecedor.nome}</Text>
                            <Text fontSize="sm" color="gray.500">
                              {fornecedor.documento}
                            </Text>
                          </Box>
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              adicionarFornecedor(fornecedor);
                              setMostrarResultadosFornecedores(false);
                            }}
                            className="!bg-gray-200 !rounded-[10px] !flex !gap-2"
                          >
                            <BsPlusCircleFill /> Adicionar
                          </Button>
                        </List.Item>
                      ))
                    ) : (
                      <Box px={3} py={2}>
                        <Text>Nenhum fornecedor encontrado</Text>
                      </Box>
                    )}
                  </List.Root>
                )}
            </Box>

            <Box
              border="1px solid #e2e8f0"
              borderRadius="md"
              overflow="hidden"
              boxShadow="sm"
              className="w-[78%] !mt-5"
            >
              <Table.Root width="100%" tableLayout="fixed">
                <Table.Header bg="gray.100">
                  <Table.Row>
                    <Table.ColumnHeader py={3} px={4} fontWeight="bold" w="50%">
                      Nome
                    </Table.ColumnHeader>
                    <Table.ColumnHeader py={3} px={4} fontWeight="bold" w="35%">
                      Documento
                    </Table.ColumnHeader>
                    <Table.ColumnHeader py={3} px={4} fontWeight="bold" w="15%">
                      Ações
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>

                <Table.Body>
                  {fornecedoresFields.length > 0 ? (
                    fornecedoresFields.map((fornecedor, index) => (
                      <Table.Row
                        key={fornecedor.fornecedor.id}
                        bg={index % 2 === 0 ? "white" : "gray.50"}
                        _hover={{ bg: "gray.100" }}
                      >
                        <Table.Cell
                          py={3}
                          px={4}
                          w="50%"
                          whiteSpace="nowrap"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          isTruncated
                        >
                          {fornecedor.fornecedor.nome}
                        </Table.Cell>
                        <Table.Cell
                          py={3}
                          px={4}
                          w="35%"
                          whiteSpace="nowrap"
                          overflow="hidden"
                          textOverflow="ellipsis"
                          isTruncated
                        >
                          {fornecedor.fornecedor.documento}
                        </Table.Cell>
                        <Table.Cell py={3} px={4} w="15%">
                          <IconButton
                            aria-label="Remover"
                            onClick={() => removeFornecedor(index)}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            _hover={{ bg: "red.50", color: "red.500" }}
                          >
                            <FaTrashCan />
                          </IconButton>
                        </Table.Cell>
                      </Table.Row>
                    ))
                  ) : (
                    <Table.Row>
                      <Table.Cell
                        colSpan={3}
                        py={4}
                        textAlign="center"
                        className="!text-gray-400"
                      >
                        <LuTriangleAlert className="!inline-block !mr-2 !mt-[-2px]" />
                        Nenhum fornecedor selecionado
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table.Root>
            </Box>
          </Box>
        </Tabs.Content>
      </Tabs.Root>
    </form>
  );
}
