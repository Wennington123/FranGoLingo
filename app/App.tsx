import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { setAudioModeAsync, setIsAudioActiveAsync } from "expo-audio";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type { RootStackParamList } from "./src/navigation";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { ReaderScreen } from "./src/screens/ReaderScreen";
import { SoundEffectsProvider } from "./src/components/SoundEffects";
import { ReviewScreen } from "./src/screens/ReviewScreen";
import { StoriesScreen } from "./src/screens/StoriesScreen";
import { TrailScreen } from "./src/screens/TrailScreen";
import { useOnboarding } from "./src/store/onboarding";
import { colors, font } from "./src/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const seenTutorial = useOnboarding((s) => s.seenTutorial);
  const [fontsLoaded, fontError] = useFonts(MaterialCommunityIcons.font);

  useEffect(() => {
    void setIsAudioActiveAsync(true);
    void setAudioModeAsync({
      playsInSilentMode: true,
      interruptionMode: "duckOthers",
      allowsRecording: false,
      shouldPlayInBackground: false,
      shouldRouteThroughEarpiece: false,
    });
  }, []);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <SoundEffectsProvider>
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <StatusBar style="dark" />
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: colors.bg },
              headerShadowVisible: false,
              headerTintColor: colors.text,
              headerTitleStyle: { fontWeight: font.bold, color: colors.text },
            }}
          >
            <Stack.Screen
              name="Trail"
              component={TrailScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Reader"
              component={ReaderScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Stories"
              component={StoriesScreen}
              options={{ title: "Histórias" }}
            />
            <Stack.Screen name="Review" component={ReviewScreen} options={{ title: "Revisão" }} />
          </Stack.Navigator>
        </NavigationContainer>

        {!seenTutorial && <OnboardingScreen />}
        </View>
      </SoundEffectsProvider>
    </SafeAreaProvider>
  );
}
