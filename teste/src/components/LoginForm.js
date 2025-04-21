// components/LoginForm.js
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, Flex, Input, Link, Text } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { PasswordInput } from "@/components/ui/password-input";
import { LuUser } from "react-icons/lu";
import { FaLock, FaAngleLeft } from "react-icons/fa";
import { TbLogin2 } from "react-icons/tb";
import Spinner from "@/components/Spinner";
import { Switch } from "@/components/ui/switch";

const LoginForm = ({
  onSubmit,
  rememberMe,
  setRememberMe,
  savedUser,
  setShowLoginForm,
  setShowPasswordResetForm,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  return (
    <>
      <h2 className="title-login">Login</h2>
      <p className="description-login">
        Por favor, preencha as informações abaixo.
      </p>

      {savedUser.length > 0 && (
        <Button
          variant="outline"
          className=" !absolute top-5 left-5 !p-3 rounded-xl"
          onClick={() => setShowLoginForm(false)}
        >
          <FaAngleLeft />
          Voltar
        </Button>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="!space-y-4">
        <Field label="">
          <InputGroup
            className="w-full flex items-center"
            flex="1"
            startElement={<LuUser className="!text-[17px]" />}
          >
            <Input
              className={`input-padrao flex-1 ${
                errors.email ? "input-error" : ""
              }`}
              placeholder="Usuário"
              size="lg"
              type="email"
              {...register("email", {
                required: "O email é obrigatório",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Formato de email inválido",
                },
              })}
            />
          </InputGroup>
          {errors.email && (
            <Text color="red.500" fontSize="sm">
              {errors.email.message}
            </Text>
          )}
        </Field>

        <Field label="">
          <InputGroup
            className="w-full flex items-center"
            flex="1"
            startElement={<FaLock className="text-md" />}
          >
            <PasswordInput
              className={`input-padrao flex-1 ${
                errors.password ? "input-error" : ""
              }`}
              placeholder="Senha"
              size="lg"
              {...register("password", {
                required: "A senha é obrigatória",
              })}
            />
          </InputGroup>
          {errors.password && (
            <Text color="red.500" fontSize="sm">
              {errors.password.message}
            </Text>
          )}
        </Field>

        <Button
          type="submit"
          size="xl"
          className="botao-teste w-full !text-white !rounded"
          variant="solid"
          loading={isSubmitting}
          loadingText="Acessando..."
          spinner={<Spinner />}
        >
          Acessar <TbLogin2 className="mt-[3px]" />
        </Button>

        <Flex justify="space-between" align="center" id="group-actions">
          <Flex align="center">
            <Switch
              id="remember-me"
              className="mt-[2px]"
              checked={rememberMe}
              onCheckedChange={(e) => setRememberMe(e.checked)}
            />
            <Text className="remember-me" ml={2}>
              Lembrar de mim
            </Text>
          </Flex>
          <Link color="blue.500" onClick={() => setShowPasswordResetForm(true)}>
            Esqueci minha senha
          </Link>
        </Flex>
      </form>
    </>
  );
};

export default LoginForm;
