import { useState, useEffect } from "react";
import { View, Text, Button } from "react-native";
import { useAuth } from "../../contexts/AuthContext";
import { DropdownCustom } from "../../components/DropdownCustom";
import { getApiUrl } from "../../config/api";

export default function PerfilScreen() {
  const { usuario } = useAuth();
  const [dados, setDados] = useState(null);
  const [valorSelecionado, setValorSelecionado] = useState(null);
  const [anoSelecionado, setAnoSelecionado] = useState(null);

  const API_URL = getApiUrl();

  const mesesAno = [
    { label: "Janeiro", value: "01" },
    { label: "Fevereiro", value: "02" },
    { label: "Março", value: "03" },
    { label: "Abril", value: "04" },
    { label: "Maio", value: "05" },
    { label: "Junho", value: "06" },
    { label: "Julho", value: "07" },
    { label: "Agosto", value: "08" },
    { label: "Setembro", value: "09" },
    { label: "Outubro", value: "10" },
    { label: "Novembro", value: "11" },
    { label: "Dezembro", value: "12" },
  ];

  const anos = Array.from({ length: 3 }, (_, i) => {
    const anoAtual = new Date().getFullYear();
    return {
      label: (anoAtual - i).toString(),
      value: (anoAtual - i).toString(),
    };
  });

  return (
    <View className="flex-1 bg-slate-900 justify-center items-center px-6">
      <View>
        <Text className="text-2xl font-bold text-white mb-2">
          Perfil de {usuario?.nome}
        </Text>
        <Text className="text-slate-400 text-center">
          Email: {usuario?.email}
        </Text>
      </View>
      <View className="flex-row gap-2 bg-slate-900 p-4">
        <View className="flex-1">
          <DropdownCustom
            label="Selecione o Mês"
            data={mesesAno}
            value={valorSelecionado}
            onChange={setValorSelecionado}
            placeholder="Escolha um mês..."
          />
        </View>
        <View className="flex-1">
          <DropdownCustom
            label="Selecione o Ano"
            data={anos}
            value={anoSelecionado}
            onChange={setAnoSelecionado}
            placeholder="Escolha um ano..."
          />
        </View>
      </View>
      <View className="flex-row gap-2 mt-4">
        {valorSelecionado && anoSelecionado && (
          <Button className="bg-blue-500 text-white p-2 rounded" title="Buscar" onPress={() => {
            setValorSelecionado(null);
            setAnoSelecionado(null);
          }} />
        )}
      </View>
    </View>
  );
}
