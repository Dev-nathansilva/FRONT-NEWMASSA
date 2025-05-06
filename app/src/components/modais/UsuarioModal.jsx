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
  FileUpload,
  Icon,
} from "@chakra-ui/react";
import { LuUpload, LuX } from "react-icons/lu";

import { Controller } from "react-hook-form";
import { withMask } from "use-mask-input";
import { PasswordInput } from "../ui/password-input";
import { useEffect, useRef } from "react";

export default function UsuarioModal({
  register,
  control,
  errors,
  documentoRef,
  setValue,
  // isEditando,
  watch,
}) {
  // const isEditandoRef = useRef(isEditando);
  // useEffect(() => {
  //   isEditandoRef.current = isEditando;
  // }, [isEditando]);

  const id = watch("id");
  const isEditando = !!id;

  return (
    <form id="formUsuario">
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

          <Box className="flex gap-8 items-start">
            <Field.Root className="!w-[280px]">
              <Field.Label>Foto de Perfil</Field.Label>

              <Controller
                name="fotoPerfil"
                control={control}
                render={({ field }) => (
                  <>
                    {field.value ? (
                      <Box
                        position="relative"
                        w="217px"
                        h="250px"
                        borderRadius="md"
                        overflow="hidden"
                      >
                        <img
                          src={
                            typeof field.value === "string"
                              ? `http://localhost:5000/uploads/${field.value}`
                              : URL.createObjectURL(field.value)
                          }
                          alt="Foto de perfil"
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                        <Icon
                          as={LuX}
                          position="absolute"
                          top="1"
                          right="1"
                          boxSize={5}
                          color="white"
                          bg="blackAlpha.700"
                          borderRadius="full"
                          p="1"
                          cursor="pointer"
                          onClick={() => field.onChange(null)}
                          _hover={{ bg: "red.500" }}
                        />
                      </Box>
                    ) : (
                      <FileUpload.Root
                        maxW="xl"
                        maxFiles={1}
                        accept="image/*"
                        className="!w-fit"
                      >
                        <FileUpload.HiddenInput
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) field.onChange(file);
                          }}
                        />
                        <FileUpload.Dropzone>
                          <Icon as={LuUpload} boxSize={6} color="fg.muted" />
                          <FileUpload.DropzoneContent>
                            <Box fontWeight="medium">
                              Arraste uma imagem ou clique
                            </Box>
                            <Box color="fg.muted" fontSize="sm">
                              .png, .jpg até 5MB
                            </Box>
                          </FileUpload.DropzoneContent>
                        </FileUpload.Dropzone>
                      </FileUpload.Root>
                    )}
                  </>
                )}
              />
            </Field.Root>

            <SimpleGrid
              columns={{ base: 1, md: 2 }}
              className="gap-x-10 gap-y-3 !px-3 !w-full"
            >
              <Field.Root required invalid={!!errors.name}>
                <Field.Label>
                  Nome <Field.RequiredIndicator />{" "}
                </Field.Label>
                <Controller
                  name="name"
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

                <Field.ErrorText>{errors.name?.message}</Field.ErrorText>
              </Field.Root>

              <Controller
                name="nivel"
                control={control}
                rules={{ required: "Selecione um item da lista" }}
                render={({ field }) => (
                  <Field.Root required invalid={!!errors.nivel}>
                    <Field.Label>
                      Nivel <Field.RequiredIndicator />
                    </Field.Label>
                    <NativeSelect.Root>
                      <NativeSelect.Field
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                        }}
                      >
                        <option value="">Selecione um nivel</option>
                        <option value="Padrão">Padrão</option>
                        <option value="Admin">Admin</option>
                        <option value="Vendedor">Vendedor</option>
                      </NativeSelect.Field>
                      <NativeSelect.Indicator />
                    </NativeSelect.Root>
                    <Field.ErrorText>{errors.cargo?.message}</Field.ErrorText>
                  </Field.Root>
                )}
              />

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

              {!isEditando && (
                <Field.Root required invalid={!!errors.password}>
                  <Field.Label>
                    Senha <Field.RequiredIndicator />
                  </Field.Label>

                  <InputGroup>
                    <PasswordInput
                      disabled={isEditando}
                      placeholder="Senha"
                      {...register("password", {
                        required: "A senha é obrigatória",
                      })}
                    />
                  </InputGroup>

                  <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
                </Field.Root>
              )}
            </SimpleGrid>
          </Box>
        </Box>
      </Stack>
    </form>
  );
}
