import { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Share } from "react-native";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "../../contexts/AuthContext";
import { DropdownCustom } from "../../components/DropdownCustom";
import CustomAlert from "../../components/CustomAlert";
import { getApiUrl } from "../../config/api";

interface HoleriteItem {
  CHAPA: string;
  NOME: string;
  FUNCAO: string;
  CODEVENTO: string;
  EVENTO: string;
  PROVDESCBASE: string;
  TIPO: "Provento" | "Desconto";
  DTPAGTO: string;
  VALOR: number;
  REF: number;
}

export default function HoleriteScreen() {
  const { usuario } = useAuth();
  const API_URL = getApiUrl();
  const [valorSelecionado, setValorSelecionado] = useState<string | null>(null);
  const [anoSelecionado, setAnoSelecionado] = useState<string | null>(null);
  const [dados, setDados] = useState<HoleriteItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const mesesAno = [
    { label: "Janeiro", value: "1" },
    { label: "Fevereiro", value: "2" },
    { label: "Março", value: "3" },
    { label: "Abril", value: "4" },
    { label: "Maio", value: "5" },
    { label: "Junho", value: "6" },
    { label: "Julho", value: "7" },
    { label: "Agosto", value: "8" },
    { label: "Setembro", value: "9" },
    { label: "Outubro", value: "10" },
    { label: "Novembro", value: "11" },
    { label: "Dezembro", value: "12" },
  ];

  const anos = Array.from({ length: 3 }, (_, i) => {
    const anoAtual = new Date().getFullYear();
    return { label: (anoAtual - i).toString(), value: (anoAtual - i).toString() };
  });

  async function buscarHolerite() {
    console.log("Buscando holerite - Chapa:", usuario?.chapa, "Ano:", anoSelecionado, "Mes:", valorSelecionado);
    setLoading(true);
    try {
      const token = await SecureStore.getItemAsync("app_user_token");
      const response = await fetch(`${API_URL}/financ/busca-pagto/${usuario?.chapa}/${Number(anoSelecionado)}/${Number(valorSelecionado)}/3/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`HTTP ${response.status}: ${text}`);
      }
      const data: HoleriteItem[] = await response.json();
      setDados(data);
    } catch (error) {
      setAlertMessage(`Erro: ${error.message}`);
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  }

  const proventos = dados?.filter((item) => item.TIPO === "Provento") ?? [];
  const descontos = dados?.filter((item) => item.TIPO === "Desconto") ?? [];
  const totalProventos = proventos.reduce((acc, item) => acc + item.VALOR, 0);
  const totalDescontos = descontos.reduce((acc, item) => acc + item.VALOR, 0);
  const liquido = totalProventos - totalDescontos;

  async function compartilharHolerite() {
    if (!dados) return;

    const mes = mesesAno.find((m) => m.value === valorSelecionado)?.label ?? valorSelecionado;
    const linhas = dados.map(
      (item) => `${item.TIPO === "Provento" ? "+" : "-"} ${item.EVENTO}: R$ ${item.VALOR.toFixed(2)}`
    );

    const texto = [
      `HOLERITE - ${mes}/${anoSelecionado}`,
      `${dados[0].NOME} (${dados[0].FUNCAO})`,
      "=".repeat(30),
      ...linhas,
      "=".repeat(30),
      `Proventos: R$ ${totalProventos.toFixed(2)}`,
      `Descontos: R$ ${totalDescontos.toFixed(2)}`,
      `Líquido: R$ ${liquido.toFixed(2)}`,
    ].join("\n");

    try {
      await Share.share({ message: texto, title: `Holerite ${mes}/${anoSelecionado}` });
    } catch (error) {
      setAlertMessage("Erro ao compartilhar");
      setAlertVisible(true);
    }
  }

  return (
    <ScrollView className="flex-1 bg-slate-900 px-4 pt-6">
      <Text className="text-cyan-400 text-2xl font-bold mb-6">Holerite</Text>

      <View className="flex-row gap-2 mb-4">
        <View className="flex-1">
          <DropdownCustom
            label="Mês"
            data={mesesAno}
            value={valorSelecionado}
            onChange={setValorSelecionado}
            placeholder="Mês"
          />
        </View>
        <View className="flex-1">
          <DropdownCustom
            label="Ano"
            data={anos}
            value={anoSelecionado}
            onChange={setAnoSelecionado}
            placeholder="Ano"
          />
        </View>
      </View>

      {valorSelecionado && anoSelecionado && (
        <TouchableOpacity
          onPress={buscarHolerite}
          disabled={loading}
          className="bg-cyan-600 py-3 px-6 rounded-xl items-center mb-6"
        >
          <Text className="text-white font-bold">
            {loading ? "Buscando..." : "Buscar Holerite"}
          </Text>
        </TouchableOpacity>
      )}

      {loading && <ActivityIndicator size="large" color="#22d3ee" className="mt-10" />}

      {dados && dados.length > 0 && (
        <>
          <View className="bg-slate-800 rounded-xl p-4 mb-4">
            <Text className="text-white text-lg font-bold">{dados[0].NOME}</Text>
            <Text className="text-slate-400 text-sm">{dados[0].FUNCAO}</Text>
            <Text className="text-slate-400 text-sm">Chapa: {dados[0].CHAPA}</Text>
          </View>

          <View className="flex-row gap-3 mb-4">
            <View className="flex-1 bg-green-900/40 rounded-xl p-4 items-center">
              <Text className="text-green-400 text-xs uppercase">Proventos</Text>
              <Text className="text-green-300 text-lg font-bold">
                R$ {totalProventos.toFixed(2)}
              </Text>
            </View>
            <View className="flex-1 bg-red-900/40 rounded-xl p-4 items-center">
              <Text className="text-red-400 text-xs uppercase">Descontos</Text>
              <Text className="text-red-300 text-lg font-bold">
                R$ {totalDescontos.toFixed(2)}
              </Text>
            </View>
          </View>

          <View className="bg-slate-800 rounded-xl p-4 mb-4">
            <Text className="text-white text-sm uppercase tracking-wider mb-1">Líquido</Text>
            <Text className={`text-2xl font-bold ${liquido >= 0 ? "text-cyan-400" : "text-red-400"}`}>
              R$ {liquido.toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity
            onPress={compartilharHolerite}
            className="bg-slate-700 py-3 px-6 rounded-xl items-center mb-6"
          >
            <Text className="text-white font-bold">Compartilhar</Text>
          </TouchableOpacity>

          {proventos.length > 0 && (
            <View className="mb-4">
              <Text className="text-green-400 text-lg font-bold mb-2">Proventos</Text>
              {proventos.map((item, index) => (
                <View key={index} className="bg-slate-800/60 rounded-lg px-4 py-3 mb-1 flex-row justify-between">
                  <View className="flex-1">
                    <Text className="text-white text-sm">{item.EVENTO}</Text>
                    <Text className="text-slate-500 text-xs">{item.CODEVENTO}</Text>
                  </View>
                  <Text className="text-green-300 font-semibold">
                    R$ {item.VALOR.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {descontos.length > 0 && (
            <View className="mb-6">
              <Text className="text-red-400 text-lg font-bold mb-2">Descontos</Text>
              {descontos.map((item, index) => (
                <View key={index} className="bg-slate-800/60 rounded-lg px-4 py-3 mb-1 flex-row justify-between">
                  <View className="flex-1">
                    <Text className="text-white text-sm">{item.EVENTO}</Text>
                    <Text className="text-slate-500 text-xs">{item.CODEVENTO}</Text>
                  </View>
                  <Text className="text-red-300 font-semibold">
                    R$ {item.VALOR.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </>
      )}

      {dados && dados.length === 0 && (
        <Text className="text-slate-400 text-center mt-10">Nenhum dado encontrado.</Text>
      )}

      {alertVisible && (
        <CustomAlert
          message={alertMessage}
          onClose={() => setAlertVisible(false)}
        />
      )}
    </ScrollView>
  );
}
