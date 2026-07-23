import { useState, useEffect } from "react";
import { View, Text, Pressable, Image } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { File, Paths } from "expo-file-system";
import { useAuth } from "../../contexts/AuthContext";

const fotoArquivo = new File(Paths.document, "avatar.jpg");

export default function PerfilScreen() {
  const { usuario } = useAuth();
  const [fotoUri, setFotoUri] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (fotoArquivo.exists) setFotoUri(fotoArquivo.uri);
    })();
  }, []);

  async function selecionarFoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const origem = new File(result.assets[0].uri);
      origem.copy(fotoArquivo);
      setFotoUri(fotoArquivo.uri);
    }
  }

  const iniciais = usuario?.nome
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View className="flex-1 bg-slate-900 justify-center items-center px-6">
      <Pressable onPress={selecionarFoto} className="mb-4">
        {fotoUri ? (
          <Image
            source={{ uri: fotoUri }}
            className="w-24 h-24 rounded-full"
          />
        ) : (
          <View className="w-24 h-24 rounded-full bg-cyan-600 items-center justify-center">
            <Text className="text-white text-3xl font-bold">{iniciais}</Text>
          </View>
        )}
      </Pressable>
      <Text className="text-2xl font-bold text-white mb-2">
        {usuario?.nome}
      </Text>
      <Text className="text-slate-400 text-center mt-1">
        {usuario?.chapa} - {usuario?.funcao}
      </Text>
      <Text className="text-slate-400 text-center">
        Email: {usuario?.email}
      </Text>
    </View>
  );
}
