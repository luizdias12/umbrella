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
import { useRouter } from "expo-router";
import CustomAlert from "../components/CustomAlert";

export default function LoginScreen() {
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  // Estados para armazenar os dados do formulário
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    // Aqui entrará a sua lógica de autenticação com a API futuramente
    if (username && password) {
      setAlertMessage(`Bem-vindo, ${username}! Login realizado com sucesso.`);
      setShowAlert(true);
    } else {
      setAlertMessage("Por favor, preencha todos os campos.");
      setShowAlert(true);
    }
  };

  return (
    // KeyboardAvoidingView garante que o teclado do celular não cubra os inputs quando subir
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-900"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 bg-slate-900 justify-center px-6">
          {showAlert && (
            <CustomAlert
              message={alertMessage}
              onClose={() => setShowAlert(false)}
            />
          )}
        </View>
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
            {/* Input de E-mail */}
            <View>
              <Text className="text-slate-300 text-sm font-medium mb-2">
                Usuario
              </Text>
              <TextInput
                className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700 focus:border-cyan-400"
                placeholder="Usuario AD"
                placeholderTextColor="#64748b" // slate-500
                keyboardType="default"
                autoCapitalize="none"
                autoCorrect={false}
                value={username}
                onChangeText={setUsername}
              />
            </View>

            {/* Input de Senha */}
            <View className="mt-4">
              <Text className="text-slate-300 text-sm font-medium mb-2">
                Senha
              </Text>
              <View className="relative w-full justify-center">
                <TextInput
                  className="w-full bg-slate-800 text-white pl-4 pr-12 py-3 rounded-xl border border-slate-700 focus:border-cyan-400"
                  placeholder="••••••••"
                  placeholderTextColor="#64748b"
                  secureTextEntry={!showPassword} // Esconde a senha se false
                  autoCapitalize="none"
                  autoCorrect={false}
                  value={password}
                  onChangeText={setPassword}
                />

                {/* Botão de Mostrar/Esconder Senha dentro do Input */}
                <Pressable
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4 active:opacity-60"
                >
                  <Text className="text-cyan-400 text-xs font-bold">
                    {showPassword ? "OCULTAR" : "MOSTRAR"}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Esqueceu a senha */}
            <Pressable className="align-self-end mt-2 active:opacity-70">
              <Text className="text-cyan-400 text-xs font-medium text-right">
                Esqueceu sua senha?
              </Text>
            </Pressable>

            {/* Botão de Entrar */}
            <Pressable
              onPress={handleLogin}
              className="w-full bg-cyan-400 py-4 rounded-xl items-center mt-6 active:opacity-90 shadow-md shadow-cyan-400/20"
            >
              <Text className="text-slate-900 font-bold text-lg">Entrar</Text>
            </Pressable>
          </View>

          {/* Rodapé / Criar Conta */}
          <View className="flex-row justify-center mt-10">
            <Text className="text-slate-400 text-sm">Não tem uma conta? </Text>
            <Pressable
              onPress={() => router.push("/register")}
              className="active:opacity-70"
            >
              <Text className="text-cyan-400 text-sm font-semibold">
                Cadastre-se
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
