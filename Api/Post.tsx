import axios from "axios";
import { ImageInfo, ImagePickerResult } from "expo-image-picker";
import { useEffect, useState } from "react";
import { IPostProps } from "../Interface/IPostProps";
import SettingStore, { ISettings } from "../Store/SettingStore";
import * as Mime from "react-native-mime-types";
import AuthStore, { IAuth } from "../Store/AuthStore";
import ErrorAlert from "../Lib/ErrorAlert";
import { AlertState } from "../Store/AlertState";

export const useFetch = (initialProjectId: string, done?: () => void) => {
  const [projectId] = useState(initialProjectId);
  const [posts, setPosts] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [evalKey, setEvalKey] = useState(undefined);

  const settingStore = SettingStore();
  const authStore = AuthStore();

  const update = () => {
    setRefresh(refresh + 1);
  };

  const loadMore = () => {
    fetchPosts();
  }

  const fetchPosts = async () => {
    console.log(`${settingStore.host}/post/${projectId}`);
    axios.get(`${settingStore.host}/post/${projectId}`, {
      params: {
        startKey: evalKey
      }
    }).then((result) => {
      const retPosts = result.data.posts;
      setEvalKey(result.data.key);
      console.log(`evalKey update`)
      console.log(result.data.key);

      for (const post of retPosts) {
        posts.push({
          projectId: post.projectId,
          postId: post.postId,
          description: post.description,
          date: post.date,
          photos: post.photos,
          like: post.like,
          update: undefined,
        });
      }

      setPosts([...posts]);

      if (done) {
        done();
      }
    });
  };

  useEffect(() => {
    console.log("훅!")
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, refresh]);

  return { posts, loadMore };
};

export const createPost = async (
  projectId: string,
  desc: string,
  images: ImagePickerResult[],
  settingStore: ISettings,
  authStore: IAuth
) => {
  const form = new FormData();

  for (const image of images as ImageInfo[]) {
    const fname = image.uri.substring(
      image.uri.lastIndexOf("/") + 1,
      image.uri.length
    );
    const mime = Mime.lookup(fname);
    form.append("img", {
      uri: image.uri,
      name: fname,
      type: mime,
    });
  }

  //form.getBuffer;
  try {
    form.append("projectId", projectId);
    form.append("title", "");
    form.append("description", desc);
  } catch (except) {
    console.log(except);
  }

  const res = await fetch(`${settingStore.host}/post`, {
    method: "put",
    body: form,
    headers: {
      "x-access-token": authStore.accessToken,
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  });
  const json = await res.json();

  if ("errors" in json) {
    const errorMessage = ErrorAlert(json.errors, (msg) => {
      msg("Request is not authorized", (param) => {
        param("default", (err) => {
          err(AlertState.REQUEST_NOT_AUTHORIZE);
        });
      });

      msg("Invalid value", (param) => {
        param("description", (err) => {
          err(AlertState.DESCRIPTION_SHORT);
        });
        param("files.img", (err) => {
          err(AlertState.IMG_EMPTY);
        });
      });
    });
    if (errorMessage !== "") {
      alert(errorMessage);
    }
  }

  /*
  fetch(`${settingStore.host}/post`, {
    method: "put",
    body: form,
    headers: {
      "x-access-token": authStore.accessToken,
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    },
  })
    .then(async (result) => {
      const res = await result.json();
      if ("errors" in res) {
        const errorMessage = ErrorAlert(res.errors, (msg) => {
          msg("Request is not authorized", (param) => {
            param("default", (err) => {
              err(AlertState.REQUEST_NOT_AUTHORIZE);
            });
          });

          msg("Invalid value", (param) => {
            param("description", (err) => {
              err(AlertState.DESCRIPTION_SHORT);
            });
            param("files.img", (err) => {
              err(AlertState.IMG_EMPTY);
            });
          });
        });
        if (errorMessage !== "") {
          alert(errorMessage);
        }
      } else {
        if (done) {
          done();
        }
        //p.navigation.pop(1);
      }
    })
    .catch((err) => {
      alert(AlertState.SERVER_NOT_RESPONSE);
    });
    */
};

export const deletePost = async (
  projectId: string,
  postId: string,
  settingStore: ISettings,
  authStore: IAuth
) => {
  await axios
    .delete(`${settingStore.host}/post`, {
      params: {
        projectId,
        postId,
      },
      headers: {
        "x-access-token": authStore.accessToken,
      },
    })
};

export const likePost = async (
  projectId: string,
  postId: string,
  settingStore: ISettings,
  authStore: IAuth
) => {
  const result = await axios.put(
    `${settingStore.host}/post/like`,
    {
      projectId,
      postId,
    },
    {
      headers: {
        "x-access-token": authStore.accessToken,
      },
    }
  );

  console.log(result.data);
};

export const dislikePost = async (
  projectId: string,
  postId: string,
  settingStore: ISettings,
  authStore: IAuth
) => {
  const result = await axios.delete(`${settingStore.host}/post/like`, {
    params: {
      projectId,
      postId,
    },
    headers: {
      "x-access-token": authStore.accessToken,
    },
  });
};

//export default useFetch;
