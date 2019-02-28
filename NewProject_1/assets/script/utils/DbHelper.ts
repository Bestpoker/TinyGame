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

    static Init() {
        if (CC_WECHATGAME) {
            const wx = window["wx"];
            wx.cloud.init();
            // 1. 获取数据库引用
            const db = wx.cloud.database();

            // db.collection('player').get({
            //     success(res) {
            //         console.log("有记录 " + res.data['_id']);
            //     },
            //     fail(res) {
            //         console.log("无记录 " + res.data['_id']);
            //     }
            // })

            // db.collection('player').count({
            //     success(res) {
            //         console.log("记录条数 " + res.total);
            //     }
            // })

            // db.collection('player').set('GameLevel')({
            //     // data 字段表示需新增的 JSON 数据
            //     data: {
            //         level: '1',
            //     },
            //     success(res) {
            //         // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            //         console.log("创建成功 " + res.data['_id']);
            //     },
            //     fail(res){
            //         console.log("创建失败 " + res.data['_id']);
            //     }
            // })

            // db.collection('player').add({
            //     // data 字段表示需新增的 JSON 数据
            //     data: {
            //          _id: 'GameLevel',
            //     },
            //     success(res) {
            //         // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            //         console.log("创建成功res: " + res);
            //         console.log("创建成功res.data: " + res.data);
            //     }
            // });

            db.collection('player').where({
                _id: 'GameLevel' // 填入当前用户 openid
            }).get({
                success(res) {
                    console.log("有记录")
                    console.log(res.data)
                },
                fail() {
                    console.log("无记录")
                },
                complete() {
                    console.log("查询完毕")
                }
            })

            // db.collection('player').where({
            //     _openid: 'oH5wo40nN8pN5aNLGOKjxnNjHkiU' // 填入当前用户 openid
            // }).get({
            //     success(res) {
            //         console.log(res.data);
            //     }
            // })


        }
    }

    static DbSetGameLevel() {
        if (CC_WECHATGAME) {

            // DbHelper.db.collection('player').set('GameLevel')({
            //     // data 字段表示需新增的 JSON 数据
            //     data: {
            //         level: '1',
            //     },
            //     success(res) {
            //         // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            //         console.log("创建成功");
            //     }
            // })

            // db.collection('player').add({
            //     // data 字段表示需新增的 JSON 数据
            //     data: {
            //         // _id: 'user_1',
            //         _openid: 'openID_1' // 假设用户的 openid 为 user-open-id
            //     },
            //     success(res) {
            //         // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
            //         console.log("创建成功res: " + res);
            //         console.log("创建成功res.data: " + res.data);
            //     }
            // });

            // db.collection("player").doc("test").get({
            //     success(res) {
            //         // res.data 包含该记录的数据
            //         console.log("读取成功");
            //         console.log("读取成功res.data: " + res.data["tip"]);
            //         GameManager.instance.tipLabel.string = res.data["tip"];
            //     }
            // });

            // db.collection("player").doc("test1").get({
            //     success(res) {
            //         // res.data 包含该记录的数据
            //         console.log("读取成功");
            //         console.log("读取成功res.data: " + res.data["tip"]);
            //         GameManager.instance.tipLabel.string = res.data["tip"];
            //     }
            // });

            // console.log("onload success");

        }
    }

}
