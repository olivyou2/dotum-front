import { useEffect, useState } from "react";
import {
  View,
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  DatePickerIOSBase,
} from "react-native";

import SettingStore from "../../Store/SettingStore";
import axios from "axios";
import { AlertState } from "../../Store/AlertState";
import ErrorAlert from "../../Lib/ErrorAlert";
import AuthStore from "../../Store/AuthStore";
import { StackActions } from "@react-navigation/native";
import { SignInStackProps } from "../../App";
import { get, save } from "../../Store/StorageStore";

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
    borderBottomWidth: 1,
    padding: 10,
    borderColor: "gray",
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
    marginTop: 1,
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

export default function App({ navigation }:SignInStackProps) {

  const [id, changeId] = useState("korea");
  const [password, changePassword] = useState("south");
  
  const { host } = SettingStore();
  const authStore = AuthStore();

  const autoLogin = async () => {
    try{
      let data = await get();

      // If server returns 400, then goto catch:
      await axios.get(`${host}/token/${data.accessToken}`);
      
      authStore.setId(data.id);
      authStore.setToken(data.accessToken);

      navigation.dispatch(StackActions.replace("Main"));
    }catch(error){
    }
  };

  useEffect(() => {
    autoLogin();
  }, []);

  const Login = (id: string, password: string) => {
    axios.post(`${host}/user`, {id:id, password:password})
    .then((res) => {
      let token = res.data.token as string;
      
      authStore.setId(id);
      authStore.setToken(token);
      
      save({
        id: id,
        accessToken: token
      });

      navigation.dispatch(StackActions.replace("Main"));
    })
    .catch((err) => {
      if (err.response){
        let errors = ErrorAlert(err.response.data.errors, (msg) => {
          msg("user is not exists", (param) => {
            param("default", (err) => {
              err(AlertState.USER_NOT_EXISTS);
            });
          });
        });

        alert(errors);
      }else{
        alert(AlertState.SERVER_NOT_RESPONSE);
      }
    });
  };

  const onClickRegister = () => {
    navigation.navigate("SignUp")
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
      <TouchableOpacity style={styles.loginContainer} onPressOut={() => Login(id, password)}>
        <Text style={styles.loginText}>Sign In</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerContainer} onPressOut={() => onClickRegister()}>
        <Text style={styles.registerText}>Sign Up</Text>
      </TouchableOpacity>

      <View style={styles.forgetBox}>
        <Text style={styles.forgetText}>아이디나 비밀번호를 잊으셨나요?</Text>
      </View>
    </View>
  );
}
