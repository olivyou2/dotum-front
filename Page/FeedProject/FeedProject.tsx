/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/react-in-jsx-scope */
import { FeedProjectStackProps } from "../../App";
import {
  StyleSheet,
  View,
  Text,
  RefreshControl,
  Image,
  TouchableOpacity,
  Alert,
  Vibration,
  NativeSyntheticEvent,
  NativeScrollEvent,
  ActivityIndicator,
} from "react-native";
import { useCallback, useEffect, useState } from "react";
import AuthStore from "../../Store/AuthStore";
import { EvilIcons, AntDesign, MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native";
import { GetScreenInfo } from "../../Api/Screen";
import { IPostProps } from "../../Interface/IPostProps";
import { deletePost, dislikePost, likePost, useFetch } from "../../Api/Post";
import SettingStore from "../../Store/SettingStore";
import { TextInput } from "react-native-gesture-handler";
import { createComment, deleteComment, useComments } from "../../Api/Comment";
import { ICommentProps } from "../../Interface/ICommentProps";
import { DateExpand } from "../../Lib/Date";

const { width, height, vw, vh } = GetScreenInfo();

function Comment(props: ICommentProps): JSX.Element {
  const settingStore = SettingStore();
  const authStore = AuthStore();

  const styles = StyleSheet.create({
    commentView: {
      height: 40,
    },

    commentAuthor: {
      fontWeight: "800",
      color: "red",
    },

    commentDesc: {},
  });

  const onTouch = async () => {
    Vibration.vibrate(10);
    Alert.alert("댓글 삭제", "정말 댓글을 삭제하시겠습니까?", [
      {
        text: "예",
        onPress: async () => {
          await deleteComment(
            props.postId,
            props.commentId,
            authStore,
            settingStore
          );
          props.onUpdate();
        },
      },
      {
        text: "아니오",
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.commentView} onLongPress={() => onTouch()}>
      <Text style={styles.commentAuthor}>{props.commentAuthor}</Text>
      <Text style={styles.commentDesc}>{props.commentDesc}</Text>
    </TouchableOpacity>
  );
}

function Post(props: IPostProps): JSX.Element {
  const styles = StyleSheet.create({
    post: {
      width: "100%",
      paddingLeft: 10,
      paddingRight: 10,
      paddingTop: 10,
      paddingBottom: 10,
      borderBottomColor: "#dfdfdf",
      borderBottomWidth: 1,
      backgroundColor: "white",
    },

    postContent: {
      borderBottomColor: "#dfdfdf",
      borderBottomWidth: 1,
    },

    pictureContainer: {
      marginBottom: 10,
    },

    titleContainer: {},

    titleText: {
      fontSize: 8,
    },

    descContainer: {
      marginBottom: 10,
    },
    dateContainer: {},

    dateText: {
      marginBottom: 10,
    },

    commentView: {},

    commentWriteView: {
      paddingTop: 10,
      height: 45,
      display: "flex",
      flexDirection: "row",
      borderTopColor: "#dfdfdf",
      borderTopWidth: 1,
    },
    commentInput: {
      width: "70%",
      color: "black",
    },
    commentButton: {
      backgroundColor: "white",
      width: "20%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    commentButtonText: {
      color: "#429bf5",
    },
    likes: {},
  });

  const date = new Date(props.date);
  const { comments, update } = useComments(props.postId);
  const [commentField, setCommentField] = useState("");

  const authStore = AuthStore();
  const settingStore = SettingStore();

  const writeComment = async () => {
    await createComment(props.postId, commentField, authStore, settingStore);
    update();

    setCommentField("");
  };

  const onClickLike = async () => {
    if (!props.like.includes(authStore.id)) {
      await likePost(
        props.projectId,
        props.postId,
        settingStore,
        authStore
      );
    } else {
      await dislikePost(
        props.projectId,
        props.postId,
        settingStore,
        authStore
      );
    }

    props.update();
  };

  const onDeletePost = async () => {
    Vibration.vibrate(10);
    Alert.alert("게시글 삭제", "게시글을 삭제하시겠습니까?", [
      {
        text: "예",
        onPress: async () => {
          await deletePost(
            props.projectId,
            props.postId,
            settingStore,
            authStore
          );

          props.update();
        },
      },
      {
        text: "아니오",
      },
    ]);
  };

  return (
    <TouchableOpacity style={styles.post} onLongPress={() => onDeletePost()}>
      <View style={styles.postContent}>
        <View style={styles.pictureContainer}>
          <ScrollView horizontal={true}>
            {props.photos.map((photo) => (
              <Image
                key={photo}
                source={{
                  uri: photo,
                  width: width * 0.9,
                  height: width * 0.9,
                }}
              ></Image>
            ))}
          </ScrollView>
        </View>
        <View style={styles.likes}>
          <Text>{props.like.length}</Text>
        </View>
        <View style={styles.descContainer}>
          <Text>{props.description}</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{DateExpand.GetTime(date)}</Text>
        </View>
      </View>

      <View style={styles.commentView}>
        {comments.map((comment) => (
          <Comment
            key={comment.commentId}
            commentAuthor={comment.userId}
            commentDesc={comment.comment}
            commentId={comment.commentId}
            postId={props.postId}
            onUpdate={() => update()}
          ></Comment>
        ))}
      </View>
      <View style={styles.commentWriteView}>
        <TextInput
          style={styles.commentInput}
          value={commentField}
          onChangeText={setCommentField}
          placeholder={`${authStore.id} 으로 댓글 달기`}
        ></TextInput>
        <TouchableOpacity
          style={styles.commentButton}
          onPress={() => writeComment()}
        >
          <Text style={styles.commentButtonText}>게시</Text>
        </TouchableOpacity>
        <AntDesign
          name={props.like.includes(authStore.id) ? "heart" : "hearto"}
          size={32}
          onPress={() => onClickLike()}
        ></AntDesign>
      </View>
    </TouchableOpacity>
  );
}

export default function FeedProject(p: FeedProjectStackProps) {
  const authStore = AuthStore();

  const { posts, loadMore } = useFetch(p.route.params.projectId, () => {
    setRefreshing(false);
    setShowLoading(false);
  });
  const [refreshing, setRefreshing] = useState(false);
  const [showLoading, setShowLoading] = useState(false);

  const onClickWrite = () => {
    p.navigation.navigate("CreatePost", {
      projectId: p.route.params.projectId,
    });
  };

  const onClickLog = () => {
    p.navigation.navigate("FeedLogs", {
      projectId: p.route.params.projectId,
      projectName: p.route.params.projectName,
      userId: p.route.params.userId
    });
  };

  const renderWrite = () => {
    return (
      <EvilIcons
        name="pencil"
        size={30}
        color="black"
        style={{ marginRight: 10 }}
        onPress={() => onClickWrite()}
      />
    );
  };

  const renderLogs = () => {
    return (
      <MaterialIcons
        name="attach-money"
        size={30}
        color="black"
        style={{ marginRight: 10 }}
        onPress={() => onClickLog()}
      />
    );
  };

  useEffect(() => {
    p.navigation.setOptions({ title: p.route.params.projectName });

    const menuStlyeSheet = StyleSheet.create({
      menuStyle: {
        display: "flex",
        flexDirection: "row",
      },
    });

    const writeMenu = (
      <View style={menuStlyeSheet.menuStyle}>
        {authStore.id == p.route.params.userId ? renderWrite() : undefined}
        {renderLogs()}
      </View>
    );

    p.navigation.setOptions({
      headerRight: () => writeMenu,
    });
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    //update();
  }, [refreshing]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      width: width,
      height: height,
    },

    absoulteContainer: {
      position: "absolute",
      top: 0,
      left: 0,
      width: 100 * vw,
      height: 100 * vh,

      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  });

  const isCloseToBottom = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const paddingToBottom = 20;
    return e.nativeEvent.layoutMeasurement.height + e.nativeEvent.contentOffset.y >=
      e.nativeEvent.contentSize.height - paddingToBottom
  }

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.container}
        onScroll={(e) => {
          console.log("1")
          if (!showLoading) {
            const isClose = isCloseToBottom(e);

            if (isClose) {
              setShowLoading(true);
              loadMore();
            }
          }
        }}
      >
        {posts.map((post) => (
          <Post
            projectId={post.projectId}
            key={post.postId}
            postId={post.postId}
            description={post.description}
            date={post.date}
            photos={post.photos}
            like={post.like}
            update={onRefresh}
          />
        ))}
      </ScrollView>

      {showLoading ? (
        <View style={styles.absoulteContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : undefined}
    </View>
  );
}
