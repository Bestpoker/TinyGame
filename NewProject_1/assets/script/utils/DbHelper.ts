import { DbPlayerData } from "../data/DbPlayerData";
import { GameData } from "../data/GameData";

export class DbHelper {

    static db;

    static playerDBName: string = 'player';

    static Init(callback: Function) {
        if (CC_WECHATGAME) {
            const wx = window["wx"];
            wx.cloud.init();

            DbHelper.db = wx.cloud.database();

            wx.cloud
                .callFunction({
                    name: 'GetOpenID',
                })
                .then(res => {
                    console.log('GetOpenID success openid ', res.result.openid)
                    DbHelper.playerDBName = 'player_' + res.result.openid;
                    DbHelper.InitDbData(callback);
                })
                .catch(reject => {
                    console.error('GetOpenID fail ', reject)
                }

                )
        }
    }

    static InitDbData(callback: Function) {
        DbHelper.GetPlayerData(function (result) {
            if (result) {
                callback(true);
            }
            else {
                DbHelper.AddPlayerData(function (result) {
                    if (result) {
                        DbHelper.GetPlayerData(callback);
                    }
                    else {
                        callback(false)
                    }
                });
            }
        });

    }

    static AddPlayerData(callback: Function) {
        DbHelper.db.collection('user')
            .add({
                // data 字段表示需新增的 JSON 数据
                data: {
                    _id: DbHelper.playerDBName
                },
            })
            .then(res => {
                console.log("创建player成功 res");
                console.log(res);
                callback(true)
            })
            .catch(reject => {
                console.error("创建玩家信息失败 ", reject)
                callback(false);
            })
    }


    static GetPlayerData(callback: Function) {
        DbHelper.db.collection('user').doc(DbHelper.playerDBName)
            .get({})
            .then(res => {
                console.log("查询成功 res.data")
                console.log(res.data)

                // GameData.instance.playerData = res.data as DbPlayer;

                var data = res.data as DbPlayerData;

                for (const key of Object.keys(GameData.instance.playerData)) {
                    if (data.hasOwnProperty(key)) {
                        if (data.valueOf() != null && data.valueOf() != undefined) {
                            GameData.instance.playerData[key] = data[key];
                        }
                    }

                }

                callback(true);
            })
            .catch(reject => {
                console.error("查询玩家游戏信息失败 ", reject)
                callback(false);

            });
    }


    static SetPlayerData() {
        if (CC_WECHATGAME) {
            DbHelper.db.collection('user').doc(DbHelper.playerDBName).set({
                data: {
                    gameLevel: GameData.instance.playerData.gameLevel,
                    gold: GameData.instance.playerData.gold
                },
                success(res) {
                    if (res.stats.updated == 1 || res.stats.created == 1) {
                        console.log("设置人物属性成功");
                    }
                    else {
                        console.log("设置人物属性失败");
                    }
                },
                fail() {
                    console.log("设置人物属性失败 fail");
                }
            })


        }
    }

    static SetGameLevel() {
        if (CC_WECHATGAME) {
            console.log("更新关卡 start");
            DbHelper.db.collection('user').doc(DbHelper.playerDBName)
                .update({
                    data: {
                        gameLevel: GameData.instance.playerData.gameLevel
                    },
                })
                .then(res => {
                    if (res.stats.updated == 1) {
                        console.log("更新等级成功 " + GameData.instance.playerData.gameLevel);
                    }
                    else {
                        console.error("更新等级失败 then ", res.stats.updated);
                    }
                })
                .catch(reject => {
                    console.error("更新等级失败 ", reject);
                })


        }
    }

    static SetGold() {
        if (CC_WECHATGAME) {
            console.log("更新金币 start");
            DbHelper.db.collection('user').doc(DbHelper.playerDBName)
                .update({
                    data: {
                        gold: GameData.instance.playerData.gold
                    },
                })
                .then(res => {
                    if (res.stats.updated == 1) {
                        console.log("更新金币成功 " + GameData.instance.playerData.gold);
                    }
                    else {
                        console.error("更新金币失败 then ", res.stats.updated);
                    }
                })
                .catch(reject => {
                    console.error("更新金币失败 ", reject);
                })


        }
    }

    static SetRoles() {
        if (CC_WECHATGAME) {
            console.log("更新人物 start");
            DbHelper.db.collection('user').doc(DbHelper.playerDBName)
                .update({
                    data: {
                        roles: GameData.instance.playerData.roles
                    },
                })
                .then(res => {
                    if (res.stats.updated == 1) {
                        console.log("更新人物成功 " + GameData.instance.playerData.roles);
                    }
                    else {
                        console.error("更新人物失败 then ", res.stats.updated);
                    }
                })
                .catch(reject => {
                    console.error("更新人物失败 ", reject);
                })

        }
    }



}
