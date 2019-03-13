import { DbPlayerData } from "../data/DbPlayerData";
import { GameData } from "../data/GameData";

export class DbHelper {

    static db;

    static Init(callback: Function) {
        if (CC_WECHATGAME) {
            const wx = window["wx"];
            wx.cloud.init();
            // 1. 获取数据库引用
            DbHelper.db = wx.cloud.database();

            DbHelper.db.collection('user').where({
                _id: 'player' // 填入当前用户 openid
            }).get({
                success(res) {
                    console.log("查询成功")
                    console.log(res.data)


                    if (res.data.length == 0) {

                        DbHelper.db.collection('user').add({
                            // data 字段表示需新增的 JSON 数据
                            data: {
                                _id: 'player'
                            },
                            success(res) {
                                console.log("创建player成功");
                                console.log(res);

                                DbHelper.db.collection('user').get({
                                    success(res) {
                                        console.log("查询player成功")
                                        console.log(res.data);

                                        var player = res.data[0] as DbPlayerData;
                                        // GameData.instance.playerData = res.data[0] as DbPlayer;

                                        var data = res.data[0] as DbPlayerData;

                                        for (const key of Object.keys(GameData.instance.playerData)) {
                                            if (data.hasOwnProperty(key)) {
                                                if (data.valueOf() != null && data.valueOf() != undefined) {
                                                    GameData.instance.playerData[key] = data[key];
                                                }
                                            }
                
                                        }

                                        callback(true);
                                    },
                                    fail() {
                                        console.log("查询player失败")
                                        callback(false);
                                    }
                                });

                            },
                            fail() {
                                console.log("创建player失败")
                                callback(false);
                            }
                        });

                    }
                    else {
                        console.log(res.data[0])

                        // GameData.instance.playerData = res.data[0] as DbPlayer;

                        var data = res.data[0] as DbPlayerData;

                        for (const key of Object.keys(GameData.instance.playerData)) {
                            if (data.hasOwnProperty(key)) {
                                if (data.valueOf() != null && data.valueOf() != undefined) {
                                    GameData.instance.playerData[key] = data[key];
                                }
                            }

                        }

                        callback(true);

                    }
                },
                fail() {
                    console.log("查询失败")
                    callback(false);
                }
            })
            console.log("异步");
        }
    }

    static SetPlayerData(){
        if (CC_WECHATGAME) {
            DbHelper.db.collection('user').doc('player').set({
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
            DbHelper.db.collection('user').doc('player').update({
                data: {
                    gameLevel: GameData.instance.playerData.gameLevel
                },
                success(res) {
                    if (res.stats.updated == 1) {
                        console.log("更新等级成功" + GameData.instance.playerData.gameLevel);
                    }
                    else {
                        console.log("更新等级失败");
                    }
                },
                fail() {
                    console.log("更新等级失败 fail");
                }
            })


        }
    }

    static SetGold() {
        if (CC_WECHATGAME) {
            console.log("更新金币 start");
            DbHelper.db.collection('user').doc('player').update({
                data: {
                    gold: GameData.instance.playerData.gold
                },
                success(res) {
                    if (res.stats.updated == 1) {
                        console.log("更新金币成功 " + GameData.instance.playerData.gold);
                    }
                    else {
                        console.log("更新金币失败");
                    }
                },
                fail() {
                    console.log("更新金币失败 fail");
                }
            })


        }
    }

    static SetRoles() {
        if (CC_WECHATGAME) {
            console.log("更新人物 start");
            DbHelper.db.collection('user').doc('player').update({
                data: {
                    roles: GameData.instance.playerData.roles
                },
                success(res) {
                    if (res.stats.updated == 1) {
                        console.log("更新人物成功 " + GameData.instance.playerData.roles);
                    }
                    else {
                        console.log("更新人物失败");
                    }
                },
                fail() {
                    console.log("更新人物失败 fail");
                }
            })


        }
    }



}
