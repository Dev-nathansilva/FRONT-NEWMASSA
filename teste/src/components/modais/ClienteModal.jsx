"use client";

import {
  Box,
  Stack,
  Input,
  Heading,
  SimpleGrid,
  Select,
  Field,
  Portal,
  Badge,
  NativeSelect,
  InputGroup,
  Switch,
  Text,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";

import { useRef, useState } from "react";
import { NumericFormat } from "react-number-format";
import { withMask } from "use-mask-input";
import { HiCheck, HiX } from "react-icons/hi";

export default function ClienteModal() {
  const [tipoPessoa, setTipoPessoa] = useState("");
  const [checked, setChecked] = useState(true);
  const documentoRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  // Atualiza a máscara do documento quando tipoPessoa muda
  const handleTipoPessoaChange = (e) => {
    const valor = e.target.value;
    setTipoPessoa(valor);
    setValue("tipoPessoa", valor);
    setValue("documento", "");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={6}>
        {/* DADOS CADASTRAIS */}
        <Box>
          <Heading fontSize="md" mb={4}>
            Dados Cadastrais
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} className="gap-x-10 gap-y-3">
            <Field.Root required invalid={!!errors.nome}>
              <Field.Label>
                Nome <Field.RequiredIndicator />{" "}
              </Field.Label>
              <Input
                placeholder="Nome completo ou razão social"
                {...register("nome", { required: "Nome é obrigatório" })}
              />
              <Field.ErrorText>{errors.nome?.message}</Field.ErrorText>
            </Field.Root>

            <Controller
              name="tipoPessoa"
              control={control}
              rules={{ required: "Selecione um item da lista" }}
              render={({ field }) => (
                <Field.Root required invalid={!!errors.tipoPessoa}>
                  <Field.Label>
                    Tipo de Pessoa <Field.RequiredIndicator />
                  </Field.Label>
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleTipoPessoaChange(e); // ainda atualiza o state e reseta o documento
                      }}
                    >
                      <option value="">Selecione um tipo</option>
                      <option value="PessoaFisica">Pessoa Física</option>
                      <option value="Empresa">Empresa</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                  <Field.ErrorText>
                    {errors.tipoPessoa?.message}
                  </Field.ErrorText>
                </Field.Root>
              )}
            />

            <Field.Root required invalid={!!errors.documento}>
              <Field.Label>
                Documento (CPF/CNPJ) <Field.RequiredIndicator />
              </Field.Label>
              <Controller
                name="documento"
                control={control}
                rules={{
                  required: "Documento é obrigatório",
                  validate: (value) => {
                    const onlyNumbers = value.replace(/\D/g, "");

                    if (
                      tipoPessoa === "PessoaFisica" &&
                      onlyNumbers.length !== 11
                    ) {
                      return "CPF inválido";
                    }

                    if (tipoPessoa === "Empresa" && onlyNumbers.length !== 14) {
                      return "CNPJ inválido";
                    }

                    return true;
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ""}
                    disabled={!tipoPessoa}
                    placeholder="Digite o CPF ou CNPJ"
                    ref={(el) => {
                      field.ref(el);
                      documentoRef.current = el;
                      if (el) {
                        if (tipoPessoa === "PessoaFisica") {
                          withMask("999.999.999-99")(el);
                        } else if (tipoPessoa === "Empresa") {
                          withMask("99.999.999/9999-99")(el);
                        }
                      }
                    }}
                  />
                )}
              />
              <Field.ErrorText>{errors.documento?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root required invalid={!!errors.email}>
              <Field.Label>
                Email <Field.RequiredIndicator />
              </Field.Label>
              <Input
                type="email"
                placeholder="email@exemplo.com"
                {...register("email", {
                  required: "Email é obrigatório",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Email inválido",
                  },
                })}
              />

              <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root required invalid={!!errors.telefone}>
              <Field.Label>
                Telefone <Field.RequiredIndicator />
              </Field.Label>
              <Controller
                name="telefone"
                control={control}
                rules={{
                  required: "Telefone é obrigatório",
                  validate: (value) => {
                    const onlyNumbers = value.replace(/\D/g, "");
                    return onlyNumbers.length === 11 || "Telefone inválido";
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="(00) 00000-0000"
                    ref={(el) => {
                      field.ref(el);
                      if (el) withMask("(99) 99999-9999")(el);
                    }}
                  />
                )}
              />
              <Field.ErrorText>{errors.telefone?.message}</Field.ErrorText>
            </Field.Root>

            <Field.Root>
              <Field.Label>
                Inscrição Estadual{" "}
                <Field.RequiredIndicator
                  fallback={
                    <Badge size="xs" variant="surface">
                      Opcional
                    </Badge>
                  }
                />
              </Field.Label>
              <Input placeholder="00000000-0" />
            </Field.Root>

            <Field.Root
              orientation="horizontal"
              className="!flex !justify-start !w-[210px] !p-2 !mt-3 !mb-5 !border !border-gray-200 rounded-full"
            >
              <Field.Label>Status</Field.Label>
              <Switch.Root
                size="lg"
                checked={checked}
                onCheckedChange={(e) => setChecked(e.checked)}
              >
                <Switch.HiddenInput />
                <Switch.Control>
                  <Switch.Thumb>
                    <Switch.ThumbIndicator fallback={<HiX color="black" />}>
                      <HiCheck />
                    </Switch.ThumbIndicator>
                  </Switch.Thumb>
                </Switch.Control>
                <Switch.Label>{checked ? "Ativo" : "Inativo"}</Switch.Label>
              </Switch.Root>
            </Field.Root>
          </SimpleGrid>
        </Box>

        {/* ENDEREÇO */}
        <Box>
          <Heading fontSize="md" mb={4}>
            Endereço
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} className="gap-x-10 gap-y-3">
            <Field.Root>
              <Field.Label>Endereço</Field.Label>
              <Input
                placeholder="Rua, número, etc."
                {...register("endereco")}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>
                Complemento{" "}
                <Field.RequiredIndicator
                  fallback={
                    <Badge size="xs" variant="surface">
                      Opcional
                    </Badge>
                  }
                />
              </Field.Label>
              <Input {...register("complemento")} />
            </Field.Root>

            <Field.Root>
              <Field.Label>Cidade</Field.Label>
              <Input placeholder="Cidade" {...register("cidade")} />
            </Field.Root>

            <Field.Root>
              <Field.Label>Bairro</Field.Label>
              <Input placeholder="Bairro" {...register("bairro")} />
            </Field.Root>

            <Field.Root>
              <Field.Label>CEP</Field.Label>
              <Input
                placeholder="00000-000"
                ref={withMask("99999-999")}
                {...register("cep")}
              />
            </Field.Root>
          </SimpleGrid>
        </Box>

        {/* INFORMAÇÕES ADICIONAIS */}
        <Box>
          <Heading fontSize="md" mb={4}>
            Informações Adicionais
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} className="gap-x-10 gap-y-3">
            <Field.Root>
              <Field.Label>Observações</Field.Label>
              <Input
                placeholder="Observações..."
                {...register("observacoes")}
              />
            </Field.Root>

            <Field.Root>
              <Field.Label>Crédito</Field.Label>
              <InputGroup startAddon="R$" endAddon="BRL">
                <NumericFormat
                  customInput={Input}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fixedDecimalScale
                  allowNegative={false}
                  placeholder="0,00"
                  onValueChange={(values) =>
                    setValue("credito", values.floatValue || 0)
                  }
                />
              </InputGroup>
            </Field.Root>
          </SimpleGrid>
        </Box>
      </Stack>

      {/* Botão para testar envio (opcional) */}
      <Box mt={6} textAlign="right">
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-md"
        >
          Salvar (Debug)
        </button>
      </Box>
    </form>
  );
}
