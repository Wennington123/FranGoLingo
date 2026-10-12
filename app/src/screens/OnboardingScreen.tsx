import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DuoButton } from "../components/DuoButton";
import { Mascot, type MascotMode } from "../components/Mascot";
import { ProgressBar } from "../components/ProgressBar";
import { useOnboarding } from "../store/onboarding";
import { colors, font, radius } from "../theme";

type Step = { title: string; text: string; mode: MascotMode };

const STEPS: Step[] = [
  {
    title: "Olá! Sou o Frango",
    text: "Vou te acompanhar no francês. Vamos aprender lendo histórias?",
    mode: "idle",
  },
  { title: "Trilha de histórias", text: "Cada história que você termina desbloqueia a próxima.", mode: "idle" },
  {
    title: "Leia tocando nas palavras",
    text: "Toque em qualquer palavra em francês para ver a tradução na hora.",
    mode: "idle",
  },
  { title: "Responda os exercícios", text: "De vez em quando a história pausa e pede uma resposta.", mode: "idle" },
  {
    title: "Cuide dos corações",
    text: "Errar custa um coração. Você tem 5 por história. Não perca todos!",
    mode: "sad",
  },
  { title: "Pronto! Allez !", text: "Boa sorte. Eu apareço para comemorar quando você acertar.", mode: "happy" },
];

export function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const finishTutorial = useOnboarding((s) => s.finishTutorial);
  const step = STEPS[index];
  const last = index === STEPS.length - 1;

  const next = () => (last ? finishTutorial() : setIndex(index + 1));

  return (
    <SafeAreaView style={styles.overlay} edges={["top", "bottom"]}>
      <View style={styles.top}>
        <View style={styles.progressWrap}>
          <ProgressBar progress={(index + 1) / STEPS.length} />
        </View>
        {!last && (
          <Pressable onPress={finishTutorial} hitSlop={12}>
            <Text style={styles.skip}>Pular</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.hero}>
        <Mascot mode={step.mode} cell={13} />
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.text}>{step.text}</Text>
        <View style={styles.buttonWrap}>
          <DuoButton label={last ? "Começar" : "Continuar"} onPress={next} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.bg, zIndex: 10 },
  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
  },
  progressWrap: { flex: 1 },
  skip: { color: colors.textFaint, fontWeight: font.bold, fontSize: 15 },
  hero: { flex: 1, alignItems: "center", justifyContent: "center" },
  body: { padding: 24, gap: 10 },
  title: { fontSize: 28, fontWeight: font.bold, color: colors.text },
  text: { fontSize: 17, color: colors.textMuted, lineHeight: 24 },
  buttonWrap: { marginTop: 14 },
});
