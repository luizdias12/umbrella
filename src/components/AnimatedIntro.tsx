import React, { useEffect, useState } from "react";
import { View, Text, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  runOnJS,
} from "react-native-reanimated";
import { useRouter } from "expo-router";
import CustomAlert from "./CustomAlert";

// 1. Componente para uma única letra animada
function AnimatedLetter({ letter, index }) {
  const translateY = useSharedValue(-150);
  const opacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  useEffect(() => {
    // Mantive o seu delay de 500ms por letra para um efeito bem pausado
    const delay = index * 500;

    opacity.value = withDelay(delay, withSpring(1));

    translateY.value = withDelay(
      delay,
      withSpring(0, {
        damping: 8, // Quica bastante
        stiffness: 90,
        mass: 1,
      }),
    );
  }, [index]);

  return (
    <Animated.Text
      className="text-5xl font-bold text-cyan-400"
      style={animatedStyle}
    >
      {letter === " " ? "\u00A0" : letter}
    </Animated.Text>
  );
}

// 2. Componente Principal (Corrigido)
export default function AnimatedIntro() {
  const text = "HELLO";
  const letters = text.split("");
  const router = useRouter();

  const [showAlert, setShowAlert] = useState(false);

  // CORREÇÃO 1: Criar o valor compartilhado para a largura da linha no topo do componente
  const lineWidth = useSharedValue(0);

  // CORREÇÃO 2: Declarar o useAnimatedStyle aqui, fora do JSX
  const animatedLineStyle = useAnimatedStyle(() => {
    return {
      width: lineWidth.value,
    };
  });

  useEffect(() => {
    // Sincroniza o início da linha para quando a última letra terminar de cair
    const totalDelay = letters.length * 500;

    // CORREÇÃO 3: Disparar a animação alterando o .value dentro do useEffect
    lineWidth.value = withDelay(
      totalDelay,
      withSpring(100, { damping: 8, stiffness: 90, mass: 1 }),
    );
  }, [letters.length]);

  return (
    // CORREÇÃO 4: Envolver tudo dentro de uma única View principal (removido o fragment solto)
    <View className="flex-1 justify-center items-center">
      {/* Bloco das Letras */}
      <View className="flex-row flex-wrap justify-center">
        {letters.map((letter, index) => (
          <AnimatedLetter
            key={`${letter}-${index}`}
            letter={letter}
            index={index}
          />
        ))}
      </View>

      {/* Linha Animada (Removido o 'w-24' para não brigar com a animação de width) */}
      <Animated.View
        className="h-1 bg-cyan-400 mt-5"
        style={animatedLineStyle}
      />

      {/* Texto de Boas-vinda */}
      <Text className="text-base text-cyan-500 mt-2 font-medium">
        Welcome to the App
      </Text>

      <Pressable
        className="mt-4 bg-cyan-400 py-2 px-4 rounded-lg"
        onPress={() => router.replace("/login")}
      >
        <Text className="text-white font-semibold">Login</Text>
      </Pressable>
    </View>
  );
}
