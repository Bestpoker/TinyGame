import Role, { TeamType } from "./Role";
import Magic from "./Magic";
import Utils from "./Utils";

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

export class Grid {

    postion: cc.Vec2 = cc.Vec2.ZERO;

    role: Role = null;

}

@ccclass
export default class GameManager extends cc.Component {

    static instance: GameManager;

    @property(cc.Label)
    tipLabel: cc.Label = null;

    //#region callback
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        GameManager.instance = this;
        // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        if (CC_WECHATGAME) {
            const wx = window["wx"];
            wx.cloud.init();
            // 1. 获取数据库引用
            const db = wx.cloud.database();

            db.collection('player').add({
                // data 字段表示需新增的 JSON 数据
                data: {
                    _id: 'test', // 可选自定义 _id，在此处场景下用数据库自动分配的就可以了
                    tip: 'learn cloud database'
                },
                success(res) {
                    // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                    console.log("创建成功res: " + res);
                    console.log("创建成功res: " + res["tip"]);
                    console.log("创建成功res.data: " + res.data);
                    console.log("创建成功res.data: " + res.data["tip"]);
                }
            })

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

            db.collection("player").doc("test").get({
                success(res) {
                    // res.data 包含该记录的数据
                    console.log("读取成功");
                    console.log("读取成功res.data: " + res.data["tip"]);
                    GameManager.instance.tipLabel.string = res.data["tip"];
                }
            });

            db.collection("player").doc("test1").get({
                success(res) {
                    // res.data 包含该记录的数据
                    console.log("读取成功");
                    console.log("读取成功res.data: " + res.data["tip"]);
                    GameManager.instance.tipLabel.string = res.data["tip"];
                }
            });

            console.log("onload success");

        }
    }

    start() {
        this.InitGird();
        this.StartGame();

    }

    update(dt) {
        this.UpdateGame(dt);

    }

    lateUpdate() {
        this.allNodes = this.allNodes.sort((n1, n2) => {
            if (n1.y < n2.y) {
                return 1;
            }
            else if (n1.y > n2.y) {
                return -1;
            }
            return 0;
        });

        for (var i = 0; i < this.allNodes.length; i++) {
            this.allNodes[i].setSiblingIndex(i);
        }
    }

    // onKeyDown(event) {
    //     switch (event.keyCode) {
    //         case cc.macro.KEY.z:
    //             this.StartGame();
    //             break;
    //         case cc.macro.KEY.x:
    //             break;
    //     }
    // }
    //#endregion

    //#region  CreateRes

    @property(cc.Node)
    battleField: cc.Node = null;

    @property(cc.Prefab)
    rolePrefab: cc.Prefab = null;

    @property(cc.Prefab)
    magicPrefab: cc.Prefab = null;

    allNodes: Array<cc.Node> = [];

    players: Array<Role> = [];

    monsters: Array<Role> = [];

    magics: Array<Magic> = [];

    CreatePlayer(resID: number, pos: cc.Vec2) {
        var role = this.CreateRole(resID, pos);
        role.teamType = TeamType.Player;
        this.players.push(role);
    }

    RemovePlayer(role: Role) {
        var index = this.players.indexOf(role);
        if (index > -1) {
            this.players.splice(index, 1);
        }

        this.RemoveRole(role);
    }

    CreateMonster(resID: number, pos: cc.Vec2) {
        var role = this.CreateRole(resID, pos);
        role.teamType = TeamType.Monster;
        this.monsters.push(role);
    }

    RemoveMonster(role: Role) {
        var index = this.monsters.indexOf(role);
        if (index > -1) {
            this.monsters.splice(index, 1);
        }

        this.RemoveRole(role);
    }

    CreateRole(resID: number, pos: cc.Vec2): Role {
        var role = cc.instantiate(this.rolePrefab).getComponent(Role);
        role.resID = resID;
        role.node.setParent(this.battleField);
        role.node.setPosition(pos);
        this.EnterGrid(role, pos);
        this.allNodes.push(role.node);
        return role;
    }

    RemoveRole(role: Role) {
        var index = this.allNodes.indexOf(role.node);
        if (index > -1) {
            this.allNodes.splice(index, 1);
        }
        role.node.destroy();
        // Utils.RemoveRes(role.roleRes.resUrl);

    }

    CreateMagic(resID: number, pos: cc.Vec2) {
        var magic = cc.instantiate(this.magicPrefab).getComponent(Magic);
        magic.resID = resID;
        magic.node.setParent(this.battleField);
        magic.node.setPosition(pos);
        this.magics.push(magic);
        this.allNodes.push(magic.node);
    }

    RemoveMagic(magic: Magic) {
        var index = this.magics.indexOf(magic);
        if (index > -1) {
            this.magics.splice(index, 1);
        }

        var index = this.allNodes.indexOf(magic.node);
        if (index > -1) {
            this.allNodes.splice(index, 1);
        }

        // Utils.RemoveRes(magic.resName);

        magic.node.destroy();

    }

    //#endregion


    //#region  round

    maxTime: number = 60;

    currentTime: number = 0;

    currentTurn: TeamType = TeamType.Player;

    isGaming: boolean = false;

    totalUpdateTime: number = 0;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    StartGame() {
        this.isGaming = true;
        this.currentTime = this.maxTime;
        this.currentTurn = TeamType.Player;
        this.timeLabel.string = this.currentTime.toString();
        this.CreatePlayer(1, cc.v2(200, 0));
        this.CreateMonster(2, cc.v2(200, 500));
    }

    UpdateGame(dt) {
        if (this.isGaming) {
            if (this.currentTime <= 0 || this.players.length == 0 || this.monsters.length == 0) {
                this.EndGame();
                return;
            }

            for (var i = 0; i < this.players.length; i++) {
                this.players[i].UpdateRole(dt);
            }
            for (var i = 0; i < this.monsters.length; i++) {
                this.monsters[i].UpdateRole(dt);
            }

            this.totalUpdateTime += <number>dt;

            if (this.totalUpdateTime >= 1) {
                this.currentTime -= this.totalUpdateTime;
                if (this.currentTime <= 0) {
                    this.currentTime = 0;
                }
                this.timeLabel.string = this.currentTime.toFixed(0).toString();
                this.totalUpdateTime = 0;
            }

        }
    }

    EndGame() {

        this.isGaming = false;

        if (this.currentTime >= this.maxTime) {
            console.log("player win");
        }
        else if (this.monsters.length == 0) {
            console.log("player win");
        }
        else if (this.players.length == 0) {
            console.log("player lose");
        }

        for (var i = this.players.length - 1; i >= 0; i--) {
            this.RemovePlayer(this.players[i]);
        }

        for (var i = this.monsters.length - 1; i >= 0; i--) {
            this.RemoveMonster(this.monsters[i]);
        }

        this.scheduleOnce(function () { this.StartGame() }, 5);

    }

    //#endregion

    //#region  grid

    gridMaxX: number = 5;

    gridMaxY: number = 6;

    gridMap: { [key: string]: Grid; } = {};

    InitGird() {
        for (var i = 0; i <= this.gridMaxX; i++) {
            for (var j = 0; j <= this.gridMaxY; j++) {
                var key = cc.v2(i * 100, j * 100);
                var grid = new Grid();
                grid.postion = key;
                this.gridMap[key.toString()] = grid;
            }
        }
    }

    EnterGrid(role: Role, dest: cc.Vec2) {
        this.OutGrid(role);
        if (this.CanEnterGrid(dest)) {
            this.gridMap[dest.toString()].role = role;
            role.grid = this.gridMap[dest.toString()];
        }
    }

    OutGrid(role: Role) {
        if (role.grid) {
            this.gridMap[role.grid.postion.toString()].role = null;
            role.grid = null;
        }
    }

    CanEnterGrid(key: cc.Vec2): boolean {
        var gird = this.gridMap[key.toString()];
        if (gird) {
            if (gird.role) {
                return false;
            }
            else {
                return true;
            }
        }
        return false;
    }

    //#endregion



}
