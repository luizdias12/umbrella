import { View, Text } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

export default function HomeScreen() {
  const { usuario } = useAuth();

  return (
    <View className="flex-1 bg-slate-900 justify-center items-center px-6">
      <Text className="text-2xl font-bold text-white mb-2">
        Olá, {usuario?.nome}!
      </Text>
      <Text className="text-slate-400 text-center">
        Você está autenticado via LDAP de forma segura no sistema Umbrella.
      </Text>
    </View>
  );
}
