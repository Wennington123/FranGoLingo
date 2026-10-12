import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Mascot, type MascotMode } from "../components/Mascot";
import { useOnboarding } from "../store/onboarding";

type Step = { title: string; text: string; mode: MascotMode };

const STEPS: Step[] = [
  {
    title: "Olá! Sou o Frango",
    text: "Vou te acompanhar no francês. Vamos aprender lendo histórias?",
    mode: "idle",
  },
  {
    title: "Trilha de histórias",
    text: "Cada história que você termina desbloqueia a próxima.",
    mode: "idle",
  },
  {
    title: "Leia tocando nas palavras",
    text: "Toque em qualquer palavra em francês para ver a tradução na hora.",
    mode: "idle",
  },
  {
    title: "Responda os exercícios",
    text: "De vez em quando a história pausa e pede uma resposta.",
    mode: "idle",
  },
  {
    title: "Cuide dos corações",
    text: "Errar custa um coração. Você tem 5 por história. Não perca todos!",
    mode: "sad",
  },
  {
    title: "Pronto! Allez !",
    text: "Boa sorte. Eu apareço para comemorar quando você acertar.",
    mode: "happy",
  },
];

export function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const finishTutorial = useOnboarding((s) => s.finishTutorial);
  const step = STEPS[index];
  const last = index === STEPS.length - 1;

  const next = () => (last ? finishTutorial() : setIndex(index + 1));

  return (
    <View style={styles.overlay}>
      <Pressable style={styles.skip} onPress={finishTutorial}>
        <Text style={styles.skipText}>Pular</Text>
      </Pressable>

      <View style={styles.hero}>
        <Mascot mode={step.mode} cell={11} />
      </View>

      <View style={styles.body}>
        <Text style={styles.title}>{step.title}</Text>
        <Text style={styles.text}>{step.text}</Text>

        <View style={styles.dots}>
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>

        <Pressable style={styles.primary} onPress={next}>
          <Text style={styles.primaryText}>{last ? "Começar" : "Próximo"}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#0b1020",
    justifyContent: "space-between",
    padding: 24,
    zIndex: 10,
  },
  skip: { alignSelf: "flex-end", padding: 8 },
  skipText: { color: "#94a3b8", fontSize: 15 },
  hero: { alignItems: "center", justifyContent: "center", flex: 1 },
  body: { gap: 12 },
  title: { color: "#fff", fontSize: 26, fontWeight: "800" },
  text: { color: "#cbd5e1", fontSize: 17, lineHeight: 24 },
  dots: { flexDirection: "row", gap: 6, marginTop: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#334155" },
  dotActive: { backgroundColor: "#60a5fa", width: 20 },
  primary: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#2563eb",
    alignItems: "center",
  },
  primaryText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
