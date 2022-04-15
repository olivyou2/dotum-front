import { useState } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";

import settings from "../../Store/SettingStore"
import axios from "axios";
import { AlertState } from "../../Store/AlertState";
import ErrorAlert from "../../Lib/ErrorAlert";
import { SignUpStackProps } from "../../App";

const { width, height } = Dimensions.get("window");
const vw = width / 100;
const vh = height / 100;

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
    borderWidth: 1,
    padding: 10,
    borderColor: "black",
    color: "black",
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  logoText: {
    fontSize: 24,
    color: "gray",
  },
  loginContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    marginTop: 20,
    width:40*vw,
    backgroundColor: "skyblue",
    height: 33,
    elevation: 3,
  },
  loginText: {
    color: "white",
  },
  registerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 5,
    marginTop: 20,
    width:40*vw,
    backgroundColor: "skyblue",
    height: 33,
    elevation: 3,
  },
  registerText: {
    color: "white",
  },
  forgetBox: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  forgetText: {
    marginTop: 15,
    color: "darkgray",
  },
});

export default function App({ navigation }:SignUpStackProps) {
  const [id, changeId] = useState("");
  const [password, changePassword] = useState("");

  const { host } = settings();

  function Register (id:string, password:string) {
    axios.put(`${host}/user`, {id: id, password: password}).then((res) => {
      if (res.data){
        alert(AlertState.WELCOME_SIGNUP)
        navigation.navigate("SignIn")
      }
    }).catch((err) => {
      if (err.response){

        let errors = ErrorAlert(err.response.data.errors, (msg) => {
          msg("Invalid value", (param) => {
            param("id", ( err ) => {
              err(AlertState.ID_SHORT);
            });

            param("password", ( err ) => {
              err(AlertState.PASSWORD_SHORT);
            });
          });

          msg("user is already exists", (param) => {
            param("default", ( err ) => {
              err(AlertState.USER_ALREADY_EXISTS);
            });
          });
        });
        
        alert(errors);
      }else{
        alert(AlertState.SERVER_NOT_RESPONSE)
      }
    })
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>dotgum</Text>
      </View>

      <TextInput
        style={styles.input}
        onChangeText={changeId}
        value={id}
        placeholder="ID"
      />
      <TextInput
        style={styles.input}
        onChangeText={changePassword}
        value={password}
        placeholder="Password"
      />
      <TouchableOpacity style={styles.registerContainer} onPressOut={() => Register(id, password)}>
        <Text style={styles.registerText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}
