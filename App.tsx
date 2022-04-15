/* eslint-disable react/react-in-jsx-scope */
import { useState } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";

import SignIn from "./Page/Sign/SignIn";
import SignUp from "./Page/Sign/SignUp";
import Main from "./Page/Main/Main";
import CreateProject from "./Page/CreateProject/CreateProject";

import { NavigationContainer } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import FeedProject from "./Page/FeedProject/FeedProject";
import CreatePost from "./Page/CreatePost/CreatePost";
import FeedLogs from "./Page/FeedLogs/FeedLogs";

import { PermissionsAndroid } from "react-native";

async function requestPermission() {
  if (Platform.OS === "android") {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ]).then((result) => {
      if (
        result["android.permission.CAMERA"] &&
        result["android.permission.WRITE_EXTERNAL_STORAGE"] &&
        result["android.permission.READ_EXTERNAL_STORAGE"] === "granted"
      ) {
        console.log("모든 권한 획득");
      } else {
        console.log("권한거절");
      }
    });
  }
}

type RootStackParamList = {
  Main: undefined;
  SignIn: undefined;
  SignUp: undefined;
  CreateProject: undefined;
  FeedProject: {
    userId: string;
    projectId: string;
    projectName: string;
  };
  CreatePost: {
    projectId: string;
  };
  FeedLogs: {
    projectId: string;
    projectName: string;
    userId: string;
  };
};

export type SignInStackProps = StackScreenProps<RootStackParamList, "SignIn">;
export type SignUpStackProps = StackScreenProps<RootStackParamList, "SignUp">;
export type MainStackProps = StackScreenProps<RootStackParamList, "Main">;
export type CreateProjectStackProps = StackScreenProps<
  RootStackParamList,
  "CreateProject"
>;
export type FeedProjectStackProps = StackScreenProps<
  RootStackParamList,
  "FeedProject"
>;
export type CreatePostStackProps = StackScreenProps<
  RootStackParamList,
  "CreatePost"
>;
export type FeedLogsStackProps = StackScreenProps<
  RootStackParamList,
  "FeedLogs"
>;

const stack = createStackNavigator();

export default function App() {
  requestPermission();

  return (
    <NavigationContainer>
      <stack.Navigator initialRouteName="SignIn">
        <stack.Screen
          name="SignIn"
          component={SignIn}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="SignUp"
          component={SignUp}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="Main"
          component={Main}
          options={{ headerShown: false }}
        />
        <stack.Screen
          name="CreateProject"
          component={CreateProject}
          options={{ headerShown: true, title: "새 프로젝트" }}
        />
        <stack.Screen
          name="FeedProject"
          component={FeedProject}
          options={{ headerShown: true }}
        />
        <stack.Screen
          name="CreatePost"
          component={CreatePost}
          options={{ headerShown: true, title: "글 쓰기" }}
        />
        <stack.Screen
          name="FeedLogs"
          component={FeedLogs}
          options={{ headerShown: true, title: "재무재표" }}
        />
      </stack.Navigator>
    </NavigationContainer>
  );
}
