import React from 'react';
import { View, Text, TextInput, type TextInputProps } from 'react-native';

type CampoTextoProps = TextInputProps & {label: string};

export default function CampoTexto({ label, ...props }: CampoTextoProps) {
  return (
    <View>
        {/* Input */}
        <Text className="text-slate-300 text-sm font-medium mb-2">{label}</Text>

        <TextInput
            className="w-full bg-slate-800 text-white px-4 py-3 rounded-xl border border-slate-700"
            placeholderTextColor="#64748b"
            autoCapitalize="none"
            autoCorrect={false}
            {...props}
        />
    </View>
  );
}