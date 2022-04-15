import axios from "axios";
import { useEffect, useState } from "react";
import { IAuth } from "../Store/AuthStore";
import SettingStore, { ISettings } from "../Store/SettingStore";

export const useComments = (initialPostId: string, done?: () => void) => {
  const settingStore = SettingStore();
  const [postId] = useState(initialPostId);
  const [refresh, setRefresh] = useState(0);
  const [comments, setComments] = useState([]);

  const update = () => {
    setRefresh(refresh + 1);
  };

  useEffect(() => {
    const fetch = async () => {
      axios.get(`${settingStore.host}/comment/${postId}`).then((result) => {
        setComments(result.data.comments);

        if (done) {
          done();
        }
      });
    };

    fetch();
  }, [postId, refresh]);

  return { comments, update };
};

export const createComment = async (
  postId: string,
  comment: string,
  authStore: IAuth,
  settingStore: ISettings
) => {
  const result = await axios.put(
    `${settingStore.host}/comment`,
    {
      postId: postId,
      comment: comment,
    },
    {
      headers: {
        "x-access-token": authStore.accessToken,
      },
    }
  );
};

export const deleteComment = async (
  postId: string,
  commentId: string,
  authStore: IAuth,
  settingStore: ISettings
) => {
  const result = await axios.delete(`${settingStore.host}/comment/`, {
    params: {
      postId,
      commentId,
    },
    headers: {
      "x-access-token": authStore.accessToken,
    },
  });
};
