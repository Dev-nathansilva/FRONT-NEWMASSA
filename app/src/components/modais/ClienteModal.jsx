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
} from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import { withMask } from "use-mask-input";
import { HiCheck, HiX } from "react-icons/hi";
import { NumericFormat } from "react-number-format";

export default function ClienteModal({
  register,
  control,
  handleTipoChange,
  errors,
  tipo,
  documentoRef,
  setValue,
  clienteEditando,
}) {
  return (
    <form id="formCliente">
      <Stack spacing={6} className="!flex !flex-col !gap-10">
        {/* DADOS CADASTRAIS */}
        <Box>
          <Heading
            fontSize="md"
            mb={4}
            className="w-full !bg-gray-100 rounded-[5px] !pl-3 !border"
          >
            Dados Cadastrais
          </Heading>
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            className="gap-x-10 gap-y-3 !px-3"
          >
            <Field.Root required invalid={!!errors.nome}>
              <Field.Label>
                Nome <Field.RequiredIndicator />{" "}
              </Field.Label>
              <Controller
                name="nome"
                control={control}
                rules={{
                  required: "Nome é obrigatório",
                  maxLength: {
                    value: 100,
                    message: "Limite máximo de 100 caracteres",
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
                        maxLength={50} // opcional: permite digitar até 120, mas valida só até 100
                        placeholder="Nome completo ou razão social"
                        value={field.value || ""}
                        className="!pr-17"
                      />
                    </InputGroup>
                  );
                }}
              />

              <Field.ErrorText>{errors.nome?.message}</Field.ErrorText>
            </Field.Root>

            <Controller
              name="tipo"
              control={control}
              rules={{ required: "Selecione um item da lista" }}
              render={({ field }) => (
                <Field.Root required invalid={!!errors.tipo}>
                  <Field.Label>
                    Tipo de Pessoa <Field.RequiredIndicator />
                  </Field.Label>
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        handleTipoChange(e); // ainda atualiza o state e reseta o documento
                      }}
                    >
                      <option value="">Selecione um tipo</option>
                      <option value="Pessoa Física">Pessoa Física</option>
                      <option value="Empresa">Empresa</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                  <Field.ErrorText>{errors.tipo?.message}</Field.ErrorText>
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

                    if (tipo === "Pessoa Física" && onlyNumbers.length !== 11) {
                      return "CPF inválido";
                    }

                    if (tipo === "Empresa" && onlyNumbers.length !== 14) {
                      return "CNPJ inválido";
                    }

                    return true;
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ""}
                    disabled={!tipo}
                    placeholder="Digite o CPF ou CNPJ"
                    ref={(el) => {
                      field.ref(el);
                      documentoRef.current = el;
                      if (el) {
                        if (tipo === "Pessoa Física") {
                          withMask("999.999.999-99")(el);
                        } else if (tipo === "Empresa") {
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

            <Field.Root invalid={!!errors.telefonefixo}>
              <Field.Label>Telefone Fixo</Field.Label>
              <Controller
                name="telefonefixo"
                control={control}
                rules={{
                  required: "Telefone é obrigatório",
                  validate: (value) => {
                    const onlyNumbers = value.replace(/\D/g, "");
                    return onlyNumbers.length === 10 || "Telefone inválido";
                  },
                }}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="(00) 0000-0000"
                    ref={(el) => {
                      field.ref(el);
                      if (el) withMask("(99) 9999-9999")(el);
                    }}
                  />
                )}
              />
              <Field.ErrorText>{errors.telefonefixo?.message}</Field.ErrorText>
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
              <Input
                placeholder="00000000-0"
                {...register("inscricaoEstadual")}
              />
            </Field.Root>

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
                        <Switch.ThumbIndicator fallback={<HiX color="black" />}>
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

        {/* ENDEREÇO */}
        <Box>
          <Heading
            fontSize="md"
            mb={4}
            className="w-full !bg-gray-100 rounded-[5px] !pl-3"
          >
            Endereço
          </Heading>
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            className="gap-x-10 gap-y-3 !px-3"
          >
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
              <Controller
                name="cep"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    value={field.value || ""}
                    placeholder="00000-000"
                    ref={(el) => {
                      field.ref(el);
                      if (el) withMask("99999-999")(el);
                    }}
                  />
                )}
              />
            </Field.Root>
          </SimpleGrid>
        </Box>

        {/* INFORMAÇÕES ADICIONAIS */}
        <Box>
          <Heading
            fontSize="md"
            mb={4}
            className="w-full !bg-gray-100 rounded-[5px] !pl-3"
          >
            Informações Adicionais
          </Heading>
          <SimpleGrid
            columns={{ base: 1, md: 2 }}
            className="gap-x-10 gap-y-3 !px-3"
          >
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

            <Field.Root>
              <Field.Label>Crédito</Field.Label>
              <InputGroup startAddon="R$" endAddon="BRL">
                <Controller
                  name="credito"
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
          </SimpleGrid>
        </Box>
      </Stack>
    </form>
  );
}
