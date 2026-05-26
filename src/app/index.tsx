import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AnimatedIntro from "../components/AnimatedIntro";

export default function Index() {
  return (
    <SafeAreaView className="flex-1 bg-slate-800 justify-center items-center">
      <AnimatedIntro />
    </SafeAreaView>
  );
}