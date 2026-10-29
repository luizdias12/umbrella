import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext"; // 🌟 Importa o seu Contexto de Autenticação
import CustomAlert from "../../components/CustomAlert";
import CampoTexto from "../../components/CampoTexto";
import { loginUsuario } from "../../services/authService";

import { LucideIcon, LogIn } from "lucide-react-native"; 

export default function LoginScreen() {
  const { iniciarSessao } = useAuth(); // 🌟 Puxa a função de iniciar sessão
  const [showAlert, setShowAlert] = useState(false);

  // Estados para armazenar os dados do formulário
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    // Validação de campos vazios corrigida para "OU" (se um dos dois faltar, barra)
    if (!username || !password) {
      setAlertMessage("Por favor, preencha todos os campos.");
      setShowAlert(true);
      return;
    }

    setCarregando(true);
    try {
      // 1. Faz a requisição HTTP para a API Express
      const response = await loginUsuario(username, password);

      // 2. Passa os dados brutos recebidos para o contexto tratar e salvar
      await iniciarSessao(response);

      // NOTA: Não precisamos de `router.push("/home")` aqui.
      // O `app/_layout.tsx` vai perceber que `logado` virou `true`
      // e mudará a rota do usuário para "/" (Home) automaticamente de forma segura!
    } catch (error: any) {
      // Captura o erro disparado pelo fetch/axios no authService
      setAlertMessage(
        error.message || "Erro ao fazer login. Por favor, tente novamente.",
      );
      setShowAlert(true);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-900"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Alertas flutuantes ou modais na parte superior */}
        {showAlert && (
          <View className="absolute top-12 left-0 right-0 z-50 px-6">
            <CustomAlert
              message={alertMessage}
              onClose={() => setShowAlert(false)}
              fecharLabel="Fechar"
            />
          </View>
        )}

        <View className="flex-1 justify-center px-6 py-12">
          {/* Cabeçalho */}
          <View className="items-center mb-10">
            <Text className="text-4xl font-bold text-cyan-400">Umbrella</Text>
            <Text className="text-slate-400 text-sm mt-2 text-center">
              Faça login para acessar sua conta de forma segura.
            </Text>
          </View>

          {/* Formulário */}
          <View className="space-y-4">
            {/* Input de Usuário */}
            <CampoTexto
              label="Usuário"
              placeholder="Usuário AD"
              value={username}
              onChangeText={setUsername}
            />

            {/* Input de Senha */}
            <CampoTexto
              label="Senha"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />

            {/* Botão de Mostrar/Esconder Senha */}
            <Pressable
              onPress={() => setShowPassword((v) => !v)}
              className="self-end mt-2 active:opacity-60"
              accessibilityRole="button"
              accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              <Text className="text-cyan-400 text-xs font-bold">
                {showPassword ? "OCULTAR" : "MOSTRAR"}
              </Text>
            </Pressable>

            {/* Esqueceu a senha */}
            <Pressable className="self-end mt-2 active:opacity-70">
              <Text className="text-cyan-400 text-xs font-medium text-right mt-1">
                Esqueceu sua senha?
              </Text>
            </Pressable>

            {/* Botão de Entrar */}
            <Pressable
              onPress={handleLogin}
              className="flex-row justify-center items-center gap-3 bg-cyan-400 py-4 rounded-xl mt-6 active:opacity-90 shadow-md shadow-cyan-400/20"
              disabled={carregando}
            >
              <LogIn size={20} />
              <Text className="text-slate-900 text-base font-bold">
                {carregando ? "Entrando..." : "Entrar"}
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}