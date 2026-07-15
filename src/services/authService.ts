import { getApiUrl } from '../config/api';

const API_URL = getApiUrl();

async function fetchWithTimeout(url: string, options: RequestInit, timeout = 8000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(id);
  }
}

export const loginUsuario = async (usuario: string, senha: string) => {
  const response = await fetchWithTimeout(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario, senha }),
  });

  if (!response.ok) {
    throw new Error("Erro ao fazer login", {
      cause: await response.json().catch(() => response.statusText),
    });
  }

  const data = await response.json();

  if (data.usuario?.nome) {
    try {
      const responseFunc = await fetchWithTimeout(
        `${API_URL}/func/nome/${encodeURIComponent(data.usuario.nome)}`,
        { method: "GET", headers: { "Content-Type": "application/json" } },
      );

      if (responseFunc.ok) {
        data.funcionario = await responseFunc.json();
      }
    } catch (error) {
      console.warn("Falha ao buscar dados do funcionário (não crítico):", error);
    }
  }

  return data;
};
