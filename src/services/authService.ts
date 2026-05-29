// src/services/authService.ts

// Substitua pelo IP da sua máquina onde a API do Express está rodando
const API_URL = "http://192.168.101.52:3730/api";

export const loginUsuario = async (usuario: string, senha: string) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ usuario, senha }),
  });

  if (!response.ok) {
    // Captura o erro retornado pelo seu ApiError do backend
    throw new Error("Erro ao fazer login", {  cause: await response.json().catch(() => response.statusText) });
  }

  const data = await response.json();
  console.log("🚀 ~ loginUsuario ~ data:", data);

  if (data.usuario.nome) {
    try {
      const responseFunc = await fetch(
        `${API_URL}/func/nome/${data.usuario.nome}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const dataFunc = await responseFunc.json();

      if (!responseFunc.ok) {
        throw new Error(
          dataFunc.message || "Dados do funcionário não encontrados",
        );
      }
      data.funcionario = dataFunc; // Adiciona os dados do funcionário à resposta final
    } catch (error) {
      // console.error("Erro ao buscar dados do funcionário:", error);
      throw new Error("Falha ao obter dados do funcionário.", { cause: error });
    }
  }

  return data; // Retorna os dados do usuário e o token
};
