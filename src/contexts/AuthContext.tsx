// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, useContext, useCallback, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { sanitizarGruposLDAP } from '../utils/sanitize';
import { initcap } from '../utils/initcap';

import { AuthContextData, LoginResponse, UsuarioLDAP } from '../types/auth';

interface AuthProviderProps {
  children: ReactNode;
}

// Inicialização do Contexto com o Tipo Correto
// const AuthContext = createContext<AuthContextData>({} as AuthContextData);
const AuthContext = createContext<AuthContextData | undefined>(undefined);

const STORAGE_KEYS = {
  TOKEN: 'app_user_token',
  USER: 'app_user_data',
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Tipando os estados do React
  const [usuarioLogado, setUsuarioLogado] = useState<UsuarioLDAP | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Função que verifica se já existe uma sessão ativa ao abrir o app
  useEffect(() => {
    async function carregarDadosArmazenados() {
      try {
        const token = await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN);
        const usuarioDados = await SecureStore.getItemAsync(STORAGE_KEYS.USER);

        if (token && usuarioDados) {
          // Restaura os dados para o estado global da sessão
          setUsuarioLogado(JSON.parse(usuarioDados) as UsuarioLDAP);
        }
      } catch (e) {
        console.error('Erro ao carregar dados da sessão:', e);
        throw new Error('Falha ao carregar dados de sessão.', { cause: e });
      } finally {
        setLoading(false);
      }
    }

    carregarDadosArmazenados();
  }, []);

  const iniciarSessao = useCallback(async (respostaApi: LoginResponse): Promise<void> => {
    setLoading(true);
    try {
      const { token, usuario, funcionario } = respostaApi;

      // 1. Trata ou filtra os dados do LDAP aqui se necessário
      const dadosTratados: UsuarioLDAP = {
        uid: usuario.uid,
        nome: usuario.nome || 'Usuário Sem Nome',
        email: usuario.email ? usuario.email.toLowerCase() : '',
        chapa: funcionario?.CHAPA || 'Sem Chapa',
        funcao: funcionario?.FUNCAO || 'Sem Função',
        secao: funcionario?.SECAO ? initcap(funcionario.SECAO) : 'Sem Seção',
        cpf: funcionario?.CPF || 'Sem CPF',
        grupos: sanitizarGruposLDAP(usuario.grupos),
        logadoEm: new Date().toISOString()
      };
      console.log("🚀 ~ iniciarSessao ~ dadosTratados:", dadosTratados)

      // 2. Armazena de forma persistente no dispositivo
      await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, token);
      await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(dadosTratados));

      // 3. Salva no estado do React para uso imediato na sessão
      setUsuarioLogado(dadosTratados);
    } catch (error) {
      console.error('Erro ao tratar e salvar dados da sessão:', error);
      throw new Error('Falha ao processar dados de login.', { cause: error });
    } finally {
      setLoading(false);
    }
  }, []);

  const encerrarSessao = useCallback(async (): Promise<void> => {
    await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.USER);
    setUsuarioLogado(null); 
  }, []);

  return (
    <AuthContext.Provider value={{ 
      // Corrigido: Testando o valor do objeto, não a função de modificação
      logado: !!usuarioLogado, 
      usuario: usuarioLogado, 
      loading, 
      iniciarSessao, 
      encerrarSessao 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para facilitar o uso nas telas
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser utilizado dentro de um AuthProvider');
  }
  return context;
}