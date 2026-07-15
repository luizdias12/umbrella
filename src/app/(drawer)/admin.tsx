import { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { getApiUrl } from "../../config/api";
import CustomAlert from "../../components/CustomAlert";

export default function AdminScreen() {
  const { usuario } = useAuth();
  const API_URL = getApiUrl();
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: "",
  });

  async function corrigirSalarioFamilia() {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/salfamilia/corrigir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (response.ok) {
        setAlert({
          visible: true,
          message: `Incidencias atualizadas: ${data.incsalfamAtualizados}\nCriancas atualizadas: ${data.criancasAtualizadas}`,
        });
      } else {
        setAlert({
          visible: true,
          message: data.statusText || "Erro ao executar correcao",
        });
      }
    } catch (error) {
      setAlert({
        visible: true,
        message: "Erro de conexao com o servidor",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-slate-900 px-4 pt-6">
      <Text className="text-cyan-400 text-2xl font-bold mb-6">Admin</Text>

      <TouchableOpacity
        onPress={corrigirSalarioFamilia}
        disabled={loading}
        className="bg-cyan-600 py-3 px-6 rounded-xl items-center"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-bold">Acertar Salario Familia</Text>
        )}
      </TouchableOpacity>

      {alert.visible && (
        <CustomAlert
          message={alert.message}
          onClose={() => setAlert({ visible: false, message: "" })}
        />
      )}
    </View>
  );
}
