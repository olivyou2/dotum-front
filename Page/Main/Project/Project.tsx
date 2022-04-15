/* eslint-disable react-hooks/exhaustive-deps */
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  GestureResponderEvent,
  RefreshControl,
  ToastAndroid,
} from "react-native";
import { ScrollView } from "react-native";
import { StackScreenProps } from "@react-navigation/stack";
import { MainProjectProps } from "../Main";
import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import SettingStore from "../../../Store/SettingStore";
import AuthStore from "../../../Store/AuthStore";
import { MainStackProps } from "../../../App";
import { IProject } from "../../../Interface/IPRoject";
import { GetScreenInfo } from "../../../Api/Screen";
import { useProjects } from "../../../Api/Project";

const { vw } = GetScreenInfo();

type ProjectSlotProps = {
  onTouchEnd: (event: GestureResponderEvent) => void;
  children?:
    | boolean
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal;
};

function ProjectSlot(
  props: ProjectSlotProps
): React.ReactElement<ProjectSlotProps> {
  const styles = StyleSheet.create({
    slotContainer: {
      display: "flex",
      width: vw * 90,
      elevation: 3,
      height: 100,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white",

      borderWidth: 0,
      borderColor: "black",
      marginLeft: vw * 5,
      marginRight: vw * 5,
      marginTop: 5,
      marginBottom: 5,
    },
  });

  return (
    <View style={styles.slotContainer} onTouchEnd={props.onTouchEnd}>
      {props.children}
    </View>
  );
}

type ProjectOldProps = {
  onTouchEnd?: (event: GestureResponderEvent) => void;
  children?:
    | boolean
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal;
  name: string;
  key: string;
  description: string;
  stackProps: MainStackProps;
};

function ProjectOld(p: ProjectOldProps): React.ReactElement<ProjectOldProps> {
  const [containerWidth, setContainerWidth] = useState(0);

  const styles = StyleSheet.create({
    container: {
      width: "100%",
      height: "100%",
      padding: 10,
      display: "flex",
      flexDirection: "row",
    },
    projectProfile: {
      width: 80,
      height: 80,
      backgroundColor: "cyan",
      marginRight: 10,
    },
    projectSpecs: {
      width: containerWidth - 100,
      height: 80,
    },
    projectName: {},
    projectNameText: {
      fontWeight: "900",
      fontSize: 18,
    },
    description: {},
  });

  return (
    <ProjectSlot onTouchEnd={p.onTouchEnd}>
      <View
        style={styles.container}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
      >
        <View style={styles.projectProfile}></View>
        <View style={styles.projectSpecs}>
          <View style={styles.projectName}>
            <Text style={styles.projectNameText}>{p.name}</Text>
          </View>
          <View style={styles.description}>
            <Text>{p.description}</Text>
          </View>
        </View>
      </View>
    </ProjectSlot>
  );
}

type ProjectNewProps = {
  onTouchEnd: (event: GestureResponderEvent) => void;
  children?:
    | boolean
    | React.ReactChild
    | React.ReactFragment
    | React.ReactPortal;
};

function ProjectNew(
  props: ProjectNewProps
): React.ReactElement<ProjectNewProps> {
  const styles = StyleSheet.create({
    text: {
      fontSize: 48,
      fontWeight: "300",
    },
  });

  return (
    <ProjectSlot onTouchEnd={props.onTouchEnd}>
      <Text style={styles.text}>+</Text>
    </ProjectSlot>
  );
}

export default function Project(p: MainProjectProps) {
  const { route } = p;

  const stackProps = route.params.stackProps;

  const authStore = AuthStore();

  const { projects, update } = useProjects(authStore.id, () =>
    setRefreshing(false)
  );
  const [refreshing, setRefreshing] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
  });

  const navigateBack = () => {
    stackProps.navigation.navigate("CreateProject");
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    update();
  }, [refreshing]);

  const onClickProject = (
    userId: string,
    projectId: string,
    projectName: string
  ) => {
    stackProps.navigation.navigate("FeedProject", {
      userId: userId,
      projectId: projectId,
      projectName: projectName,
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          ></RefreshControl>
        }
      >
        <ProjectNew onTouchEnd={() => navigateBack()} />
        {projects.map((singleProject) => (
          <ProjectOld
            stackProps={stackProps}
            name={singleProject.ProjectName}
            key={singleProject.ProjectName}
            description={singleProject.Description}
            onTouchEnd={() =>
              onClickProject(
                singleProject.ProjectOwner,
                singleProject.ProjectId,
                singleProject.ProjectName
              )
            }
          />
        ))}
      </ScrollView>
    </View>
  );
}
