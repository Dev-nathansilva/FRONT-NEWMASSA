import { useState, useEffect } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Box, Button, Input, Text, Flex, Link, Alert } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";
import { HiOutlineMail } from "react-icons/hi";
import { HiLogin } from "react-icons/hi";
import Spinner from "./Spinner";

export default function PasswordResetForm({
  setShowLoginForm,
  setShowPasswordResetForm,
}) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue, // Usamos para atualizar o valor do campo
  } = useForm();

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false); // Para verificar erro no email

  // Limpeza da mensagem após 5 segundos
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setErrorMessage("");
      }, 3000); // Limpa o alert após 3 segundos
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  // Detecta a mudança no campo de e-mail para limpar o erro
  const handleEmailChange = (e) => {
    if (emailError) {
      setEmailError(false); // Limpa o erro quando o usuário altera o e-mail
    }
    setValue("email", e.target.value); // Atualiza o valor do campo
  };

  const onSubmit = async (data) => {
    setSuccessMessage("");
    setErrorMessage("");
    setEmailError(false); // Limpa o estado de erro ao submeter

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/password-reset`,
        {
          email: data.email,
        }
      );

      // Se a resposta for sucesso, exibe a mensagem de sucesso
      setSuccessMessage(response.data.message);
    } catch (err) {
      // Se o erro for devido ao email não cadastrado, exibe a mensagem de erro
      const message =
        err?.response?.data?.message ||
        "Erro ao solicitar redefinição de senha.";

      if (message.includes("email não cadastrado")) {
        setEmailError(true); // Aplica o erro ao campo de e-mail
      }

      setErrorMessage(message); // Exibe a mensagem de erro
    }
  };

  return (
    <Box className="max-w-md mx-auto">
      <h2 className="title-login">Redefinição de Senha</h2>
      <p className="description-login">
        Por favor, informe seu e-mail para redefinir a senha.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="!space-y-4">
        <Field label="">
          <InputGroup
            className="w-full flex items-center"
            flex="1"
            startElement={<HiOutlineMail className="text-lg" />}
          >
            <Input
              className={`input-padrao flex-1 ${
                emailError || errors.email ? "input-error" : ""
              }`} // Aplica o erro no campo
              placeholder="Digite seu e-mail"
              size="lg"
              type="email"
              {...register("email", {
                required: "E-mail é obrigatório",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Formato de e-mail inválido",
                },
              })}
              onChange={handleEmailChange} // Detecta a mudança para limpar o erro
            />
          </InputGroup>
          {errors.email && (
            <Text color="red.500" fontSize="sm">
              {errors.email.message}
            </Text>
          )}
        </Field>

        <Button
          type="submit"
          size="xl"
          className=" botao-teste w-full !text-white !rounded "
          variant="solid"
          loading={isSubmitting}
          loadingText="Enviando..."
          spinner={<Spinner />}
        >
          Enviar
        </Button>

        <Flex justify="center" align="center" gap={1} mt={4}>
          <HiLogin color="#3b82f6" />
          <Link
            color="blue.500"
            onClick={() => {
              setShowLoginForm(true);
              setShowPasswordResetForm(false);
            }}
          >
            Voltar para Login
          </Link>
        </Flex>
      </form>

      {successMessage && (
        <Alert.Root
          status="success"
          position="absolute"
          width="auto"
          zIndex="9999"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            top: "30px",
          }}
        >
          <Alert.Indicator />
          <Alert.Title>{successMessage}</Alert.Title>
        </Alert.Root>
      )}

      {errorMessage && (
        <Alert.Root
          status="error"
          position="absolute"
          width="auto"
          zIndex="9999"
          style={{
            left: "50%",
            transform: "translateX(-50%)",
            top: "30px",
          }}
        >
          <Alert.Indicator />
          <Alert.Title>{errorMessage}</Alert.Title>
        </Alert.Root>
      )}
    </Box>
  );
}
