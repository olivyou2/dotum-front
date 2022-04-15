import { Button, StyleSheet, View, TouchableOpacity, Text } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { CreateProjectStackProps } from "../../App";

import { Dimensions } from "react-native";
import AuthStore from "../../Store/AuthStore";
import SettingStore from "../../Store/SettingStore";
import { useState } from "react";
import axios from "axios";
import { AlertState } from "../../Store/AlertState";
import ErrorAlert from "../../Lib/ErrorAlert";

const { width, height } = Dimensions.get("screen");
const vw = width / 100;
const vh = height / 100;

export default function CreateProject(props: CreateProjectStackProps) {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
    },
    input: {
      width: 80 * vw,
      height: 40,
      margin: 5,
      borderBottomWidth: 1,
      padding: 10,
      borderColor: "gray",
      color: "black",
    },
    button: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      margin: 5,
      marginTop: 20,
      width: 40 * vw,
      backgroundColor: "skyblue",
      height: 33,
      elevation: 3,
    },
    buttonText: {
      color: "white",
    },
  });

  const [project, setProject] = useState("");
  const [description, setDescription] = useState("");
  
  const settings = SettingStore();
  const auth = AuthStore();

  const CreateProject = (project: string, description: string) => {
    const accessToken = auth.accessToken;
    const host = settings.host;
    
    axios.put(`${host}/project`, {
        projectName: project,
        description: description
    }, {
        "headers": {
            "x-access-token": accessToken
        }
    }).then((res) => {
        alert(AlertState.PROJECT_CREATED);
        props.navigation.navigate("Main");
    }).catch(err => {
        if (err.response){
            //alert(JSON.stringify(err.response.data))
            let errorMessage = ErrorAlert(err.response.data.errors, (msg) => {
                msg("Invalid value", (param) => {
                    param("projectName", (err) => {
                        err(AlertState.PROJECT_SHORT)
                    });

                    param("description", (err) => {
                        err(AlertState.PROJECT_DESCRIPTION_SHORT);
                    });
                });

                msg("project is already exists", (param) => {
                    param("default", (err) => {
                        err(AlertState.PROJECT_ALREADY_EXISTS);
                    });
                });
            });

            alert(errorMessage);
        }else{
            alert(AlertState.SERVER_NOT_RESPONSE);
        }
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={project}
        style={styles.input}
        placeholder="프로젝트 이름을 입력해주세요"
        onChangeText={setProject}
      />
      <TextInput
        value={description}
        style={styles.input}
        placeholder="프로젝트 설명을 입력해주세요"
        onChangeText={setDescription}
      />
      <TouchableOpacity style={styles.button} onPressOut={() => CreateProject(project, description)}>
        <Text style={styles.buttonText}>만들기</Text>
      </TouchableOpacity>
    </View>
  );
}
