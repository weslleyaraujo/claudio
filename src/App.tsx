import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import {
  CardStyleInterpolators,
  createStackNavigator,
} from "@react-navigation/stack";
import "intl";
import "intl/locale-data/jsonp/en";
import React from "react";
import { Platform, View } from "react-native";
import { Providers } from "./application/providers/Providers";
import { useTheme } from "./application/providers/Theming";
import { Create } from "./application/screens/Create";
import { Explore } from "./application/screens/Explore/Explore";
import { HashtagViewer } from "./application/screens/HashtagViewer";
import { Home } from "./application/screens/Home";
import { Onboarding } from "./application/screens/Onboarding/Onboarding";
import { Settings } from "./application/screens/Settings/Settings";
import { CustomDrawerContent } from "./components/CustomDrawerContent";
import { FloatingActions } from "./components/FloatingActions";
import { RootStackParamList, RootStackRoutes } from "./root-stack-routes";
import { useHasSeenOnboarding } from "./storage/onboarding";
import SplashScreen from "react-native-bootsplash";
import { PostDetails } from "./application/screens/PostDetails";

const Placeholder = () => <View style={{ flex: 1 }} />;
const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator<RootStackParamList>();
const Drawer = createDrawerNavigator();
const EXPLORE_REGEX = new RegExp(RootStackRoutes.Explore);

function TabsNavigator() {
  return (
    <Tab.Navigator
      lazy={false}
      screenOptions={{
        unmountOnBlur: false,
      }}
      tabBar={({ navigation, state }) => (
        <FloatingActions
          onCreatePress={() => navigation.navigate(RootStackRoutes.Create)}
          onHomePress={() => navigation.navigate(RootStackRoutes.Home)}
          onSearchPress={() => {
            if (EXPLORE_REGEX.test(state.history[1]?.key)) {
              // navigation.navigate(RootStackRoutes.SearchResutls);
            } else {
              navigation.navigate(RootStackRoutes.Explore);
            }
          }}
        />
      )}
    >
      <Tab.Screen name={RootStackRoutes.Home} component={Home} />
      <Tab.Screen name={RootStackRoutes.Explore} component={Explore} />
      <Tab.Screen
        name={RootStackRoutes.Placeholder}
        component={Placeholder}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate(RootStackRoutes.Create);
          },
        })}
      />
    </Tab.Navigator>
  );
}

function MainScreens() {
  const theme = useTheme();

  return (
    <RootStack.Navigator
      mode="modal"
      screenOptions={{
        headerTitle: () => null,
        headerTransparent: true,
        headerShown: false,
      }}
    >
      <RootStack.Screen
        name={RootStackRoutes.Tabs}
        component={TabsNavigator}
        options={{
          animationEnabled: true,
        }}
      />
      <RootStack.Screen
        name={RootStackRoutes.Create}
        component={Create}
        options={{
          animationEnabled: true,
          gestureEnabled: false,
        }}
      />
      <RootStack.Screen
        name={RootStackRoutes.Settings}
        component={Settings}
        options={{
          animationEnabled: true,
          gestureEnabled: true,
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}
      />
      <RootStack.Screen
        component={HashtagViewer}
        name={RootStackRoutes.HashtagViewer}
        options={{
          animationEnabled: true,
          gestureEnabled: Platform.OS === "ios",
          gestureDirection: "horizontal",
          headerShown: false,
          ...(Platform.OS === "ios" && {
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }),
          cardStyle: {
            borderWidth: 1,
            borderColor: theme.colors.backgroundAccent,
            ...theme.constants.shadow,
          },
        }}
      />
      <RootStack.Screen
        component={PostDetails}
        name={RootStackRoutes.PostDetails}
      />
    </RootStack.Navigator>
  );
}

function Root() {
  const theme = useTheme();
  // TODO: pre fetch stuff
  const { data, isLoading } = useHasSeenOnboarding();
  if (isLoading) {
    return null;
  }
  if (!data) {
    return <Onboarding />;
  }

  return (
    <Drawer.Navigator
      drawerStyle={{ backgroundColor: theme.colors.background }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name={RootStackRoutes.Placeholder}
        component={MainScreens}
      />
    </Drawer.Navigator>
  );
}

const App: React.FunctionComponent = function App() {
  SplashScreen.hide({
    fade: true,
  });
  return (
    <Providers>
      <Root />
    </Providers>
  );
};

export default App;
