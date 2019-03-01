import { DbPlayer } from "../data/DbData";
import { GameData } from "../data/GameData";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class DbHelper {

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
                                _id: 'player',
                                roleName: '无名氏',
                            },
                            success(res) {
                                console.log("创建player成功");
                                console.log(res);

                                DbHelper.db.collection('user').get({
                                    success(res) {
                                        console.log("查询player成功")
                                        console.log(res.data);

                                        var player = res.data[0] as DbPlayer;
                                        GameData.instance.playerData = res.data[0] as DbPlayer;

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

                        GameData.instance.playerData = res.data[0] as DbPlayer;

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

    static SetGameLevel() {
        if (CC_WECHATGAME) {



        }
    }



}
