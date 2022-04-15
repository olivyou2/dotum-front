import create from "zustand";

export interface ISettings {
  host: string;
  setHost: (host: string) => void;
}

export default create<ISettings>((set) => ({
  //host: "https://q7qxz6qwsl.execute-api.ap-northeast-2.amazonaws.com/production",
  host: "http://192.168.55.92:84",

  setHost: (host: string) => {
    set((state) => ({
      ...state,
      host: host,
    }));
  },
}));
