/* eslint-disable react/react-in-jsx-scope */
import { CreatePostStackProps } from "../../App";
import {
  StyleSheet,
  TextInput,
  View,
  Dimensions,
  Text,
  Image,
  Alert,
  Vibration,
} from "react-native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import SettingStore from "../../Store/SettingStore";
import AuthStore from "../../Store/AuthStore";
import { useState } from "react";
import {
  ImageInfo,
  launchImageLibraryAsync,
  MediaTypeOptions,
} from "expo-image-picker";
import { ActivityIndicator } from "react-native";
import { createPost } from "../../Api/Post";

const { width, height } = Dimensions.get("screen");
const vw = width / 100;
const vh = height / 100;

type ImagePickerResult = {
  cancelled: boolean;
  type?: string;
  uri?: string;
  width?: number;
  height?: number;
  duration?: number;
};

declare global {
  interface FormDataValue {
    uri: string;
    name: string;
    type: string;
  }

  interface FormData {
    append(name: string, value: FormDataValue, fileName?: string): void;
    set(name: string, value: FormDataValue, fileName?: string): void;
  }
}
export default function CreatePost(p: CreatePostStackProps) {
  const settingStore = SettingStore();
  const authStore = AuthStore();

  const [content, setContent] = useState("");
  const [pictures, setPictures] = useState([] as ImagePickerResult[]);
  const [showLoading, setShowLoading] = useState(false);

  const styles = StyleSheet.create({
    imageViewContainer: {
      height: width,
      marginBottom: 30,
    },

    imageView: {
      height: 100,
    },

    imageContainer: {
      width: 90 * vw,
      height: 90 * vw,
      margin: 5 * vw,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },

    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
      display: "flex",
    },

    input: {
      borderWidth: 1,
      borderColor: "gray",
      width: vw * 80,
    },

    button: {
      backgroundColor: "skyblue",
      marginTop: 10,
      padding: 5,
      elevation: 3,
    },

    buttonText: {
      color: "white",
      fontSize: 18,
    },

    absoulteContainer: {
      position: "absolute",
      width: 100 * vw,
      height: 100 * vh,

      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  const onClickImg = (ind: number) => {
    Vibration.vibrate(10);
    Alert.alert("이미지 삭제", "정말 이 이미지를 삭제하시겠습니까?", [
      {
        text: "예",
        onPress: () => {
          const npictures = JSON.parse(JSON.stringify(pictures));
          npictures.splice(ind, 1);

          setPictures(npictures);
        },
      },
      {
        text: "아니오",
      },
    ]);
  };

  const onClickButton = async (postContent: string) => {
    setShowLoading(true);

    await createPost(
      p.route.params.projectId,
      postContent,
      pictures as ImageInfo[],
      settingStore,
      authStore
    );

    setShowLoading(false);
    p.navigation.pop(1);
  };

  const pickImg = () => {
    launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    }).then((res) => {
      const result = res as ImagePickerResult;
      if (!result.cancelled) {
        setPictures([...pictures, result]);
      }
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageViewContainer}>
        <ScrollView horizontal={true} style={styles.imageView}>
          {pictures.map((picture, ind) => (
            <TouchableOpacity
              onLongPress={() => onClickImg(ind)}
              style={styles.imageContainer}
              key={picture.uri}
            >
              <Image
                source={{
                  uri: picture.uri,
                  width: width * 0.9,
                  height: width * 0.9,
                }}
              ></Image>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <TextInput
        value={content}
        onChangeText={setContent}
        style={styles.input}
        placeholder="글을 작성해주세요"
      />
      <TouchableOpacity style={styles.button} onPressOut={() => pickImg()}>
        <Text style={styles.buttonText}>사진선택</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPressOut={() => onClickButton(content)}
      >
        <Text style={styles.buttonText}>글 작성</Text>
      </TouchableOpacity>

      {showLoading ? (
        <View style={styles.absoulteContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : undefined}
    </View>
  );
}
