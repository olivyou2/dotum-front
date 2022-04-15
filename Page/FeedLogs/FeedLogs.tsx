/* eslint-disable react/react-in-jsx-scope */
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { RefreshControl, StyleSheet, Text, View, ScrollView } from "react-native";
import { createSupply, useSupplies } from "../../Api/Logs";
import { FeedLogsStackProps } from "../../App";
import { IBalanceProps } from "../../Interface/IBalanceProps";
import { ILogProps } from "../../Interface/ILogProps";
import { DateExpand } from "../../Lib/Date";
import AuthStore from "../../Store/AuthStore";
import SettingStore from "../../Store/SettingStore";

const Balance = (p: IBalanceProps) => {
    const styles = StyleSheet.create({
        balance: {
            borderBottomColor: "#dfdfdf",
            borderBottomWidth: 1,

            height: 50,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",

            paddingLeft: 10,
        },
    });

    return (
        <View style={styles.balance}>
            <Text>{`"${p.projectName}" 의 총 후원금 ${p.balance} 원`}</Text>
        </View>
    );
};

const Log = (p: ILogProps) => {
    const styles = StyleSheet.create({
        log: {
            borderBottomColor: "#dfdfdf",
            borderBottomWidth: 1,

            height: 50,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",

            paddingLeft: 10,
        },
    });

    return (
        <View style={styles.log}>
            <Text>
                {p.userId}
            </Text>
            <Text>
                {p.balance}
            </Text>
            <Text>
                {DateExpand.GetTime(new Date(p.logDate))}
            </Text>
        </View>
    )
}

export default function FeedLogs(p: FeedLogsStackProps) {
    const styles = StyleSheet.create({
        background: {
            backgroundColor: "white",
            width: "100%",
            height: "100%",
        },
    });

    const settingStore = SettingStore();
    const authStore = AuthStore();

    const { supplies, balance, supplyUpdate } = useSupplies(p.route.params.projectId, () => {
        setRefreshing(false);
    });
    const [refreshing, setRefreshing] = useState(false);

    const onRefresh = () => {
        setRefreshing(true);
        supplyUpdate();
    };

    const onCreateSupply = async () => {
        setRefreshing(true);

        await createSupply(p.route.params.projectId, 1235, settingStore, authStore);
        supplyUpdate();
    };

    const onCreateWithdraw = async () => {
        setRefreshing(true);

        await createSupply(p.route.params.projectId, 2000, settingStore, authStore);
        supplyUpdate();
    };

    useEffect(() => {
        p.navigation.setOptions({
            headerRight: () => {
                if (p.route.params.userId === authStore.id) {
                    return (<MaterialIcons
                        name="local-atm"
                        size={30}
                        style={{ marginRight: 10 }}
                        onPress={() => onCreateWithdraw()}
                    ></MaterialIcons>)
                } else {
                    (<MaterialIcons
                        name="attach-money"
                        size={30}
                        style={{ marginRight: 10 }}
                        onPress={() => onCreateSupply()}
                    ></MaterialIcons>)
                }
            }
        });
    }, []);

    return (
        <View style={styles.background}>
            <Balance
                projectId={p.route.params.projectId}
                projectName={p.route.params.projectName}
                balance={balance}
            ></Balance>
            <ScrollView horizontal={false} refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh}>

                </RefreshControl>
            }>
                {supplies.map(supply => <Log key={supply.logDate} userId={supply.userId} projectId={supply.projectId} logDate={supply.logDate} balance={supply.balance}></Log>)}
            </ScrollView>
        </View>
    );
}
