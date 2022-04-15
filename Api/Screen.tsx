import { Dimensions } from "react-native";

export function GetScreenInfo() {
  const { width, height } = Dimensions.get("screen");

  return {
    vw: width / 100,
    vh: height / 100,
    width,
    height,
  };
}
