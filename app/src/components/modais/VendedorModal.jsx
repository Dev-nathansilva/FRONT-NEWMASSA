"use client";
import {
  Box,
  Stack,
  Heading,
  SimpleGrid,
  Field,
  Input,
  InputGroup,
  Switch,
  Badge,
  Span,
} from "@chakra-ui/react";
import { Controller } from "react-hook-form";
import { withMask } from "use-mask-input";
import { HiCheck, HiX } from "react-icons/hi";
import { NumericFormat } from "react-number-format";

export default function VendedorModal({ register, control, errors, setValue }) {
  return (
    <form id="formVendedor">
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
                          color={length > 50 ? "red" : "fg.muted"}
                          textStyle="xs"
                        >
                          {length} / 50
                        </Span>
                      }
                    >
                      <Input
                        {...field}
                        maxLength={50}
                        value={field.value || ""}
                        placeholder="Nome completo ou razão social"
                        className="!pr-17"
                      />
                    </InputGroup>
                  );
                }}
              />

              <Field.ErrorText>{errors.nome?.message}</Field.ErrorText>
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

            <Field.Root invalid={!!errors.comissao}>
              <Field.Label>Comissão</Field.Label>
              <InputGroup startAddon="%">
                <Controller
                  name="comissao"
                  control={control}
                  defaultValue={""}
                  rules={{
                    min: {
                      value: 0,
                      message: "A comissão não pode ser negativa",
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      {...field}
                      type="number"
                      step="0.25"
                      placeholder="0,00"
                      min={0}
                      value={field.value ?? 0}
                    />
                  )}
                />
              </InputGroup>
              <Field.ErrorText>{errors.comissao?.message}</Field.ErrorText>
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
                          color={length > 200 ? "red" : "fg.muted"}
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
          </SimpleGrid>
        </Box>
      </Stack>
    </form>
  );
}
