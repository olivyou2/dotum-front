import create from "zustand";

export interface IAuth {
  id: string;
  accessToken: string;

  setId: (id: string) => void;
  setToken: (token: string) => void;
}

export default create<IAuth>((set) => ({
  id: "",
  accessToken: "",

  setId: (id) => {
    set((state) => ({
      ...state,
      id: id,
    }));
  },

  setToken: (token) => [
    set((state) => ({
      ...state,
      accessToken: token,
    })),
  ],
}));
