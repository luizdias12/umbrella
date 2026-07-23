// app/(drawer)/_layout.tsx
import { Drawer } from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Text, View, Pressable } from "react-native";
import { useAuth } from "../../contexts/AuthContext";

// 🌟 IMPORTANTE: Importando os ícones do Expo
import { LucideIcon, Home, User, Shield, DollarSign, LogOut, Menu } from "lucide-react-native"; 

export default function DrawerLayout() {
  const { usuario, encerrarSessao } = useAuth();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={{
          headerStyle: { backgroundColor: "#0f172a" },
          headerTintColor: "#22d3ee", // Cor do ícone de hambúrguer padrão
          headerTitleStyle: { fontWeight: "bold" },
          
          drawerStyle: { backgroundColor: "#0f172a", width: 280 },
          drawerActiveTintColor: "#22d3ee",
          drawerInactiveTintColor: "#94a3b8",
          drawerActiveBackgroundColor: "#1e293b",
        }}
        drawerContent={(props) => (
          <View className="flex-1 bg-slate-900 pt-16 px-4 pb-6">
            {/* Dados do Usuário */}
            <View className="border-b border-slate-800 pb-6 mb-4">
              <Text className="text-cyan-400 text-xl font-bold">Umbrella</Text>
              <Text className="text-white text-base font-semibold mt-2">{usuario?.nome}</Text>
              <Text className="text-slate-400 text-xs mt-1">{usuario?.email}</Text>
            </View>

            {/* Lista Dinâmica de Telas Customizada com Ícones */}
            <View className="flex-1">
              {props.state.routes.map((route, index) => {
                const isFocused = props.state.index === index;
                
                // Define qual ícone renderizar baseado no nome da rota
                let IconComponent = Home;
                let label = "Home";

                if (route.name === "perfil") {
                  IconComponent = User;
                  label = "Meu Perfil";
                }

                if (route.name === "admin") {
                  IconComponent = Shield;
                  label = "Admin";
                }

                if (route.name === "holerite") {
                  IconComponent = DollarSign;
                  label = "Holerite";
                }

                return (
                  <Pressable
                    key={route.key}
                    onPress={() => props.navigation.navigate(route.name)}
                    className={`flex-row items-center py-3 px-4 rounded-xl mb-1 ${isFocused ? 'bg-slate-800' : 'bg-transparent'}`}
                  >
                    {/* 🌟 ÍCONE AQUI */}
                    <IconComponent 
                      size={20} 
                      color={isFocused ? "#22d3ee" : "#94a3b8"} 
                    />
                    <Text className={`font-medium ml-3 ${isFocused ? 'text-cyan-400' : 'text-slate-400'}`}>
                      {label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {/* Botão Sair com Ícone */}
            <View className="border-t border-slate-800 pt-4 mb-2">
              <Pressable 
                onPress={encerrarSessao}
                className="flex-row justify-center items-center w-full bg-red-500/10 border border-red-500/30 py-3 rounded-xl active:opacity-80"
              >
                <LogOut size={18} color="#f87171" />
                <Text className="text-red-400 font-bold ml-2">SAIR</Text>
              </Pressable>
            </View>
          </View>
        )}
      >
        <Drawer.Screen name="index" options={{ title: "Menu" }} />
        <Drawer.Screen name="perfil" options={{ title: "Perfil" }} />
        <Drawer.Screen name="admin" options={{ title: "Admin" }} />
        <Drawer.Screen name="holerite" options={{ title: "Holerite" }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}