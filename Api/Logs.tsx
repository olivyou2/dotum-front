import axios from "axios";
import { useEffect, useState } from "react";
import { ISupply } from "../Interface/ISupply";
import AuthStore, { IAuth } from "../Store/AuthStore";
import SettingStore, { ISettings } from "../Store/SettingStore";

export const useSupplies = (initialProjectId, done?: () => void) => {
    const [projectId] = useState(initialProjectId);

    const [supplies, setSupplies] = useState([] as ISupply[]);
    const [balance, setBalance] = useState(0);

    const [refresh, setRefresh] = useState(0);

    const supplyUpdate = () => {
        setRefresh(refresh + 1);
    };

    const settingStore = SettingStore();
    const authStore = AuthStore();

    useEffect(() => {
        const fetchSupplies = async () => {
            try {
                const res = await axios.get(`${settingStore.host}/log/${projectId}`);
                const logArray: ISupply[] = [];

                for (const log of res.data.logs) {
                    logArray.push({
                        "balance": log.balance,
                        "logDate": log.logDate,
                        "projectId": log.projectId,
                        "userId": log.userId
                    });
                }

                setSupplies(logArray);
            } catch (err) {

                console.log(err);
            }
        }

        const fetchBalance = async () => {
            try {
                const res = await axios.get(`${settingStore.host}/balance/${projectId}`);

                const balance = parseInt(res.data.balance);
                setBalance(balance);
            } catch (err) {
                console.log(err);
            }
        };

        const promises = [
            fetchSupplies(),
            fetchBalance(),
        ]

        Promise.all(promises).then(() => {
            if (done) {
                done();
            }
        });
    }, [refresh]);

    return {
        supplies,
        balance,
        supplyUpdate
    }
};

export const createSupply = async (
    projectId: string,
    balance: number,
    settingStore: ISettings,
    authStore: IAuth
) => {
    const res = await axios.put(`${settingStore.host}/log`, {
        projectId,
        balance
    }, {
        headers: {
            "x-access-token": authStore.accessToken
        }
    })
};
