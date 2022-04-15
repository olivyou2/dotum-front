import { StyleSheet, View, Text } from "react-native";
import AuthStore from "../../Store/AuthStore";
import { createBottomTabNavigator, BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import Feed from "./Feed/Feed";
import Project from "./Project/Project";
import Settings from "./Settings/Settings";
import { FontAwesome, AntDesign, Feather } from "@expo/vector-icons";
import { MainStackProps } from "../../App";

const navigator = createBottomTabNavigator();

type RootStackParamList = {
  Feed: undefined,
  Project: {
    stackProps: MainStackProps
  },
  Settings: {
    stackProps: MainStackProps
  },
}

export type MainFeedProps = BottomTabScreenProps<RootStackParamList, "Feed">;
export type MainProjectProps = BottomTabScreenProps<RootStackParamList, "Project">;
export type MainSettingsProps = BottomTabScreenProps<RootStackParamList, "Settings">;

export default function Main(stackProps:MainStackProps) {
  const auth = AuthStore();

  return (
    <navigator.Navigator>
      <navigator.Screen
        name="Feed"
        component={Feed}
        options={{ 
          tabBarIcon: () => <Feather name="home" size={24} color="black" />,
          tabBarShowLabel: false 
        }}
        initialParams={{
        }}
      />
      <navigator.Screen
        name="Project"
        component={Project}
        options={{ tabBarIcon: () => <AntDesign name="team" size={24} color="black" />, "tabBarShowLabel": false }}    
        initialParams={{
          stackProps:stackProps
        }}
      />
      <navigator.Screen
        name="Settings"
        component={Settings}
        options={{ tabBarIcon: () => <Feather name="settings" size={24} color="black" />, "tabBarShowLabel": false }}
        initialParams={{
          stackProps:stackProps
        }}
      />
    </navigator.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
