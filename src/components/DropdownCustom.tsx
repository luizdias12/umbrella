import React from 'react';
import { View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

// 1. Definindo a tipagem dos itens da lista
interface DropdownItem {
  label: string;
  value: string;
}

// 2. Definindo as propriedades (Props) que o nosso componente vai aceitar
interface DropdownCustomProps {
  label?: string;                     // Texto acima do Dropdown (opcional)
  data: DropdownItem[];               // Array de dados [{ label, value }]
  value: string | null;               // O estado atual selecionado
  onChange: (value: string) => void;  // Função para atualizar o estado no pai
  placeholder?: string;               // Texto padrão (opcional)
  search?: boolean;                   // Ativar barra de pesquisa interna (opcional)
}

export function DropdownCustom({
  label,
  data,
  value,
  onChange,
  placeholder = "Selecione uma opção...",
  search = false
}: DropdownCustomProps) {
  
  return (
    <View className="w-full mb-4">
      {/* Se o label for enviado, renderiza o texto explicativo acima */}
      {label && (
        <Text className="text-slate-300 text-sm font-medium mb-2">
          {label}
        </Text>
      )}

      <Dropdown
        // Estilização do input fechado (casando com o tema Dark/Cyan do Umbrella)
        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3.5 focus:border-cyan-400"
        placeholderStyle={{ color: '#64748b', fontSize: 15 }}
        selectedTextStyle={{ color: '#ffffff', fontSize: 15 }}
        inputSearchStyle={{ backgroundColor: '#1e293b', color: '#ffffff', borderRadius: 8, borderColor: '#334155' }}
        iconStyle={{ width: 20, height: 20 }}
        iconColor="#22d3ee" // Cor da setinha em Cyan
        
        // Estilização da caixinha que abre (lista flutuante)
        containerStyle={{ backgroundColor: '#1e293b', borderRadius: 12, borderHeight: 0, borderColor: '#334155', marginTop: 4 }}
        activeColor="#334155" // Cor do item quando passa o dedo/seleciona
        itemTextStyle={{ color: '#cbd5e1', fontSize: 15 }}
        itemContainerStyle={{ borderRadius: 8 }}
        
        // Configurações lógicas
        data={data}
        search={search}
        searchPlaceholder="Buscar..."
        labelField="label"
        valueField="value"
        placeholder={placeholder}
        value={value}
        onChange={item => onChange(item.value)}
      />
    </View>
  );
}