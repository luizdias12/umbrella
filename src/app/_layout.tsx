// app/_layout.tsx
import "../../global.css"; // ← Keep this at the very top

import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "../contexts/AuthContext";

function InitialLayout() {
  const { logado, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Verifica se o utilizador está atualmente no grupo de telas "logado" (app/index, app/home, etc)
    // ou no grupo de autenticação (ex: app/login)
    const inAuthGroup = segments[0] === "(auth)";

    if (!logado && !inAuthGroup) {
      // Se não estiver logado e tentar aceder a uma rota protegida, manda para o login
      router.replace("/login");
    } else if (logado && inAuthGroup) {
      // Se já estiver logado e tentar ir para o login, manda para a Home/Dashboard
      router.replace("/");
    }
  }, [logado, loading, segments]);

  if (loading) {
    return null; // Ou um <ActivityIndicator /> centrado
  }

  return <Slot />;
}

export default function Layout() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <InitialLayout />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
