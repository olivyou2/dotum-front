import { StyleSheet, View, Text } from "react-native";
import AuthStore from "../../../Store/AuthStore";

export default function Feed({ navigation }) {
  const auth = AuthStore();

  return (
    <View style={styles.container}>
      <Text>여긴 아직 준비중이랍니다 ㅎ</Text>
      <Text>당신의 AccessToken 이 궁금하다면?</Text>
      <View style={styles.tokenContainer}>
        <Text>{auth.accessToken}</Text>
      </View>
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
  tokenContainer: {
    width: 300,
    marginTop:10,
    backgroundColor: "green",
  },
});
