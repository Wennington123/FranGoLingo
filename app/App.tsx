import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import type { RootStackParamList } from "./src/navigation";
import { OnboardingScreen } from "./src/screens/OnboardingScreen";
import { ReaderScreen } from "./src/screens/ReaderScreen";
import { ReviewScreen } from "./src/screens/ReviewScreen";
import { TrailScreen } from "./src/screens/TrailScreen";
import { useOnboarding } from "./src/store/onboarding";

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const seenTutorial = useOnboarding((s) => s.seenTutorial);

  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator>
          <Stack.Screen
            name="Trail"
            component={TrailScreen}
            options={{ title: "FranGoLingo" }}
          />
          <Stack.Screen
            name="Reader"
            component={ReaderScreen}
            options={{ title: "História" }}
          />
          <Stack.Screen
            name="Review"
            component={ReviewScreen}
            options={{ title: "Revisão" }}
          />
        </Stack.Navigator>
      </NavigationContainer>

      {!seenTutorial && <OnboardingScreen />}
    </View>
  );
}
