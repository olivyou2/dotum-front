import AsyncStorage from "@react-native-async-storage/async-storage";

interface IStorage{
    id: string,
    accessToken: string
}

export function save(stroageData: IStorage){
    AsyncStorage.setItem(
        "userData",
        JSON.stringify(stroageData)
    );
}

export async function get():Promise<IStorage>{
    const data = JSON.parse(await AsyncStorage.getItem("userData")) as IStorage;

    return data;
}