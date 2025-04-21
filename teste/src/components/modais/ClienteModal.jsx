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
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { NumericFormat } from "react-number-format";
import { withMask } from "use-mask-input";
import { HiCheck, HiX } from "react-icons/hi";

export default function ClienteModal() {
  const [tipoPessoa, setTipoPessoa] = useState(""); // estado para tipo de pessoa
  const [checked, setChecked] = useState(false);
  const documentoRef = useRef(null); // ref para aplicar máscara dinamicamente

  // Atualiza a máscara do documento quando tipoPessoa muda
  const handleTipoPessoaChange = (e) => {
    const valor = e.target.value;
    setTipoPessoa(valor);

    if (documentoRef.current) {
      const input = documentoRef.current;
      input.value = "";

      if (valor === "PessoaFisica") {
        withMask("999.999.999-99")(input);
      } else if (valor === "Empresa") {
        withMask("99.999.999/9999-99")(input);
      }
    }
  };

  return (
    <Stack spacing={6}>
      {/* DADOS CADASTRAIS */}
      <Box>
        <Heading fontSize="md" mb={4}>
          Dados Cadastrais
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} className="gap-x-10 gap-y-3">
          <Field.Root required>
            <Field.Label>
              Nome <Field.RequiredIndicator />{" "}
            </Field.Label>
            <Input placeholder="Nome completo ou razão social" />
          </Field.Root>

          <Field.Root required>
            <Field.Label>
              Tipo de Pessoa <Field.RequiredIndicator />
            </Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
                value={tipoPessoa}
                onChange={handleTipoPessoaChange}
              >
                <option value="">Selecione um tipo</option>
                <option value="PessoaFisica">Pessoa Física</option>
                <option value="Empresa">Empresa</option>
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
          </Field.Root>

          <Field.Root required>
            <Field.Label>
              Documento (CPF/CNPJ) <Field.RequiredIndicator />
            </Field.Label>
            <Input
              disabled={!tipoPessoa}
              placeholder="Digite o CPF ou CNPJ"
              ref={documentoRef}
            />
          </Field.Root>

          <Field.Root required>
            <Field.Label>
              Email <Field.RequiredIndicator />
            </Field.Label>
            <Input type="email" placeholder="email@exemplo.com" />
          </Field.Root>

          <Field.Root required>
            <Field.Label>
              Telefone <Field.RequiredIndicator />
            </Field.Label>
            <Input
              placeholder="(00) 00000-0000"
              ref={withMask("(99) 99999-9999")}
            />
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

          <Field.Root>
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
            <Input placeholder="Rua, número, etc." />
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
            <Input />
          </Field.Root>

          <Field.Root>
            <Field.Label>Cidade</Field.Label>
            <Input placeholder="Cidade" />
          </Field.Root>

          <Field.Root>
            <Field.Label>Bairro</Field.Label>
            <Input placeholder="Bairro" />
          </Field.Root>

          <Field.Root>
            <Field.Label>CEP</Field.Label>
            <Input placeholder="00000-000" ref={withMask("99999-999")} />
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
            <Input placeholder="Observações..." />
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
              />
            </InputGroup>
          </Field.Root>
        </SimpleGrid>
      </Box>
    </Stack>
  );
}
