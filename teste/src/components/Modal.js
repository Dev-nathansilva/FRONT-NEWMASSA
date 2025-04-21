import { useEffect } from "react";
import { useState } from "react";
import { IoMdPersonAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import { toaster } from "./ui/toaster";

const dadosClientes = {
  id: "",
  nome: "",
  email: "",
  tipo: "",
  documento: "",
  telefone: "",
  inscricaoEstadual: "",
  status: true,
};

export default function ClienteModal({ isOpen, onClose, onClienteCriado }) {
  const [cliente, setCliente] = useState(dadosClientes);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCliente((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { id, ...clienteData } = cliente;

    const payload = {
      ...clienteData,
      status: cliente.status ? "Ativo" : "Inativo",
    };

    try {
      const response = await fetch("http://localhost:5000/api/clientes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        toaster.create({
          title: "Cliente Novo!",
          description: "Cliente Criado com Sucesso",
          type: "success",
          duration: 3000,
        });
        if (onClienteCriado) onClienteCriado();
        onClose();
      } else {
        toaster.create({
          title: "Erro!",
          description: `Erro ao criar cliente: ${result.error}`,
          type: "warning",
          duration: 3000,
        });
      }
    } catch (error) {
      toaster.create({
        title: "Erro!",
        description: `Erro ao conectar com o servidor: ${error}`,
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleFechar = () => {
    const temDados = Object.values(cliente).some(
      (v) => v !== "" && v !== true && v !== false
    );

    if (temDados) {
      const confirmar = window.confirm(
        "Você tem certeza que deseja sair? Os dados preenchidos serão perdidos."
      );
      if (!confirmar) return;
    }

    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setCliente(dadosClientes);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] bg-[#313131] bg-opacity-[0.4] flex justify-center items-center">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6 shadow-lg relative">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <div className="flex items-center gap-2 text-xl font-semibold text-gray-700">
            <IoMdPersonAdd className="text-2xl text-blue-500" />
            <span>Cadastro de Clientes</span>
          </div>
          <button onClick={handleFechar}>
            <IoClose className="text-2xl text-gray-600 hover:text-red-500" />
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Código
              </label>
              <input
                type="text"
                name="id"
                value={cliente.id}
                disabled
                className="mt-1 block w-full border rounded-md px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nome
              </label>
              <input
                type="text"
                name="nome"
                value={cliente.nome}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={cliente.email}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo
              </label>
              <select
                name="tipo"
                value={cliente.tipo}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md px-3 py-2"
                required
              >
                <option value="" disabled>
                  Selecione um tipo
                </option>
                <option value="PessoaFisica">Pessoa Física</option>
                <option value="PessoaJuridica">Pessoa Jurídica</option>
                <option value="Empresa">Empresa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Documento (CPF/CNPJ)
              </label>
              <input
                type="text"
                name="documento"
                value={cliente.documento}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Telefone
              </label>
              <input
                type="tel"
                name="telefone"
                value={cliente.telefone}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Inscrição Estadual (opcional)
              </label>
              <input
                type="text"
                name="inscricaoEstadual"
                value={cliente.inscricaoEstadual}
                onChange={handleChange}
                className="mt-1 block w-full border rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-2">
            <input
              type="checkbox"
              name="status"
              checked={cliente.status}
              onChange={handleChange}
              id="status"
              className="h-4 w-4 switch"
            />
            <label htmlFor="status" className="text-sm text-gray-700">
              Cliente Ativo
            </label>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleFechar}
              className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
