import React from 'react';
import { Text, Pressable } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

export default function CustomAlert({ message, onClose }) {
  return (
    <Animated.View
      // 1. Layout Animations cuidam do surgimento e sumiço sozinhas!
      entering={FadeInUp.duration(300)} // Desce do topo fazendo fade-in
      exiting={FadeOutUp.duration(250)}  // Sobe de volta sumindo ao fechar
      
      // 2. Estilização limpa convertida para as classes do Tailwind v4
      className="absolute top-12 self-center max-w-sm bg-white/90 p-5 rounded-2xl items-center shadow-lg"
    >
      {/* Mensagem do Alerta */}
      <Text className="text-black text-base font-medium text-center">
        {message}
      </Text>

      {/* Botão de Fechar */}
      <Pressable 
        onPress={onClose} 
        className="mt-3 active:opacity-70 p-2 rounded-lg bg-slate-500/10"
      >
        <Text className="text-black text-sm font-semibold uppercase tracking-wider">
          Fechar
        </Text>
      </Pressable>
    </Animated.View>
  );
}