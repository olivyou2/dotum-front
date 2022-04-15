import { StackActions } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View, Text, Dimensions, Alert } from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { AlertState } from "../../../Store/AlertState";
import { get, save } from "../../../Store/StorageStore";
import { MainSettingsProps } from "../Main";

const { width, height } = Dimensions.get("window");
const vw = width / 100;
const vh = height / 100;

interface IButton{
    onTouchOut?: ()=>void,
    name?: string
}

function SettingButton(p:IButton):React.ReactElement<IButton>{
    const onTouch = () => {
        if (p.onTouchOut){
            p.onTouchOut();
        }
    };

    const styles = StyleSheet.create({
        button: {
            backgroundColor: "white",
            elevation: 3,

            height:80,
            width: 90*vw,

            borderWidth:0,
            borderColor:"black",
            marginLeft:vw*5,
            marginRight:vw*5,
            marginTop:5,
            marginBottom:5,

            display:"flex",
            alignItems: "center",
            justifyContent: "center"
        }
    });
    
    return (
        <TouchableOpacity style={styles.button} onPressOut={() => onTouch()}>
            <Text>
                {p.name}
            </Text>

        </TouchableOpacity>
    )
}

export default function Settings({ navigation, route }:MainSettingsProps){
    const onLogout = () => {
        save({
            accessToken: "",
            id: ""
        });

        route.params.stackProps.navigation.dispatch(StackActions.replace("SignIn"));
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <SettingButton name="로그아웃" onTouchOut={onLogout}/>
            </ScrollView>
        </View>
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