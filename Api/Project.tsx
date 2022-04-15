/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { IProject } from "../Interface/IPRoject";
import { IAuth } from "../Store/AuthStore";
import SettingStore, { ISettings } from "../Store/SettingStore";

export const likeProject = async (
  projectId: string,
  settingStore: ISettings,
  authStore: IAuth
) => {
  const result = await axios.put(
    `${settingStore.host}/project/like`,
    {
      projectId,
    },
    {
      headers: {
        "x-access-token": authStore.accessToken,
      },
    }
  );
};

export const dislikeProject = async (
  projectId: string,
  settingStore: ISettings,
  authStore: IAuth
) => {
  const result = await axios.delete(`${settingStore.host}/project/like`, {
    params: {
      projectId,
    },
    headers: {
      "x-access-token": authStore.accessToken,
    },
  });
};

export const useProjects = (initialUserId: string, done?: () => void) => {
  const [userId] = useState(initialUserId);
  const [projects, setProjects] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const settingStore = SettingStore();

  const update = () => {
    setRefresh(refresh + 1);
  };

  useEffect(() => {
    axios.get(`${settingStore.host}/project/${userId}`).then((resp) => {
      const projectData: IProject[] = [];

      for (const singleProject of resp.data.projects) {
        projectData.push({
          ProjectName: singleProject.projectName,
          Description: singleProject.description,
          ProjectId: singleProject.id,
          ProjectOwner: singleProject.userId,
        });
      }

      setProjects(projectData);

      if (done) {
        done();
      }
    });
  }, [userId, refresh]);

  return { projects, update };
};
