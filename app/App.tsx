import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import type { RootStackParamList } from "./src/navigation";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { ReaderScreen } from "./src/screens/ReaderScreen";
import { ReviewScreen } from "./src/screens/ReviewScreen";
import { TrailScreen } from "./src/screens/TrailScreen";
import { useOnboarding } from "./src/store/onboarding";
import { colors, font } from "./src/theme";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const seenTutorial = useOnboarding((s) => s.seenTutorial);

  return (
    <SafeAreaProvider>
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
            <Stack.Screen name="Review" component={ReviewScreen} options={{ title: "Revisão" }} />
          </Stack.Navigator>
        </NavigationContainer>

        {!seenTutorial && <OnboardingScreen />}
      </View>
    </SafeAreaProvider>
  );
}
