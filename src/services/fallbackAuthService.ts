// src/services/authService.js
import * as SecureStore from 'expo-secure-store';

// Substitua pelo IP da sua máquina onde a API do Express está rodando
import { getApiUrl } from '../config/api';

const API_URL = getApiUrl();
const API_TOKEN_URL = 'http://192.168.101.52:3730/api';

export const loginUsuario = async (usuario, senha) => {
  try {
    const response = await fetch(`${API_URL}/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usuario, senha }),
    });

    const tokenResponse = await fetch(`${API_TOKEN_URL}/trailcrumb`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, senha }),
    });

    const data = await response.json();
    const tokenData = await tokenResponse.json();

    console.log('Resposta do login:', data);
    console.log('Resposta do token:', tokenData);

    if (!response.ok) {
      // Captura o erro retornado pelo seu ApiError do backend
      throw new Error(data.message || 'Erro ao fazer login');
    }

    // Se o login for bem-sucedido, salva o token JWT com segurança
    if (tokenData.token) {
      await SecureStore.setItemAsync('user_token', tokenData.token);
    }

    return data; // Retorna os dados do usuário e o token

  } catch (error) {
    console.error('Erro no serviço de autenticação:', error);
    throw error;
  }
};