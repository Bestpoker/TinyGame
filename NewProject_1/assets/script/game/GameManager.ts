import Role, { TeamType } from "../entity/Role";
import Magic from "../entity/Magic";
import Utils from "../utils/Utils";
import { DbPlayerData, DbRoleData } from "../data/DbPlayerData";
import { GameData } from "../data/GameData";
import { DbHelper } from "../utils/DbHelper";
import UIManager from "../ui/UIManager";
import MainUI from "../ui/MainUI";
import { ShaderType } from "../shader/ShaderManager";

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

    position: cc.Vec2 = cc.Vec2.ZERO;

    role: Role = null;

}

@ccclass
export default class GameManager extends cc.Component {

    static instance: GameManager;

    isInited: boolean = false;

    //#region callback
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        GameManager.instance = this;
        // console.log();

        if (CC_WECHATGAME) {
            var self = this;

            DbHelper.Init(function (result) {

                if (result) {
                    console.log("初始化成功");
                    self.isInited = true;

                    console.log(GameData.instance.playerData._openid + "关卡" + GameData.instance.playerData.gameLevel);
                    console.log(GameData.instance.playerData._openid + "金币" + GameData.instance.playerData.gold);
                    self.start();
                }
                else {
                    console.log("初始化失败");
                    self.isInited = false;
                }
            });
        }
        else {
            this.isInited = true;
        }
    }

    start() {
        if (this.isInited) {

            console.log("开始游戏 start");
            if (GameData.instance.playerData.roles == null || GameData.instance.playerData.roles.length == 0) {
                var data = new DbRoleData();
                data.roleID = 1;
                GameData.instance.playerData.roles.push(data);
                data = new DbRoleData();
                data.roleID = 2;
                GameData.instance.playerData.roles.push(data);
                DbHelper.SetRoles();
            }
            else {
                var needSava = false;
                for (let index = 0; index < GameData.instance.playerData.roles.length; index++) {
                    const element = GameData.instance.playerData.roles[index];
                    if (element.roleName == null) {
                        element.roleName = "name_" + index;
                        needSava = true;
                    }
                }

                if (needSava) {
                    DbHelper.SetRoles();
                }
            }

            MainUI.instance.levelLabel.string = "关卡：" + GameData.instance.playerData.gameLevel.toString();
            MainUI.instance.goldLabel.string = GameData.instance.playerData.gold.toString();

            this.InitGird();
            this.StartGame();
        }
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

    rolePool: Array<Role> = [];

    magicPool: Array<Magic> = [];

    allNodes: Array<cc.Node> = [];

    players: Array<Role> = [];

    monsters: Array<Role> = [];

    magics: Array<Magic> = [];

    RealCreateRole(resID: number, pos: cc.Vec2, team: TeamType) {
        if (team == TeamType.Player) {
            this.CreatePlayer(resID, pos);
        }
        else if (team == TeamType.Monster) {
            this.CreateMonster(resID, pos);
        }
    }

    RealRemoveRole(role: Role) {
        if (role.teamType == TeamType.Player) {
            this.RemovePlayer(role);
        }
        else if (role.teamType == TeamType.Monster) {
            this.RemoveMonster(role);
        }
    }

    private CreatePlayer(resID: number, pos: cc.Vec2) {
        var role = this.CreateRole(resID, pos);
        if (role) {
            role.teamType = TeamType.Player;
            this.players.push(role);
        }

    }

    private RemovePlayer(role: Role) {
        var index = this.players.indexOf(role);
        if (index > -1) {
            this.players.splice(index, 1);
        }

        this.RemoveRole(role);
    }

    private CreateMonster(resID: number, pos: cc.Vec2) {
        var role = this.CreateRole(resID, pos);
        if (role) {
            role.teamType = TeamType.Monster;
            this.monsters.push(role);
        }

    }

    private RemoveMonster(role: Role) {
        var index = this.monsters.indexOf(role);
        if (index > -1) {
            this.monsters.splice(index, 1);
        }

        this.RemoveRole(role);
    }

    private CreateRole(resID: number, pos: cc.Vec2): Role {

        if (!this.CanEnterGrid(pos)) {
            return null;
        }

        var role: Role = null;
        if(this.rolePool.length > 0){
            role = this.rolePool.pop();
            role.node.active = true;
        }
        else{
            role = cc.instantiate(this.rolePrefab).getComponent(Role);
        }
        
        role.resID = resID;
        role.node.setParent(this.battleField);
        role.node.setPosition(pos);
        this.EnterGrid(role, pos);
        this.allNodes.push(role.node);
        return role;
    }

    private RemoveRole(role: Role) {
        var index = this.allNodes.indexOf(role.node);
        if (index > -1) {
            this.allNodes.splice(index, 1);
        }
        this.OutGrid(role);
        // role.node.destroy();
        role.node.active = false;
        role.isDead = true;
        this.rolePool.push(role);
        role = null;
        // Utils.RemoveRes(role.roleRes.resUrl);

    }

    CreateMagic(resID: number, pos: cc.Vec2) {
        var magic: Magic = null;
        if(this.magicPool.length > 0){
            magic = this.magicPool.pop();
            magic.node.active = true;
        }
        else{
            magic = cc.instantiate(this.magicPrefab).getComponent(Magic);
        }
        
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

        // magic.node.destroy();
        magic.node.active = false;
        this.magicPool.push(magic);
        magic = null;

    }

    //#endregion


    //#region  round

    maxTime: number = 60;

    currentTime: number = 0;

    currentTurn: TeamType = TeamType.Player;

    isGaming: boolean = false;

    totalUpdateTime: number = 0;



    StartGame() {

        for (var i = this.players.length - 1; i >= 0; i--) {
            this.RemovePlayer(this.players[i]);
        }

        for (var i = this.monsters.length - 1; i >= 0; i--) {
            this.RemoveMonster(this.monsters[i]);
        }

        this.currentTime = this.maxTime;
        this.currentTurn = TeamType.Player;
        MainUI.instance.timeLabel.string = "剩余时间：" + this.currentTime.toString();

        for (let index = 0; index < 10; index++) {
            var ranX = Utils.GetRandomInt(0, 8) * this.gridSize;
            var ranY = Utils.GetRandomInt(4, 8) * this.gridSize;
            this.RealCreateRole(2, cc.v2(ranX, ranY), TeamType.Monster);
        }

        this.RealCreateRole(1, cc.v2(2 * this.gridSize, 0), TeamType.Player);
        this.RealCreateRole(1, cc.v2(4 * this.gridSize, 0), TeamType.Player);

        for (var i = this.monsters.length - 1; i >= 0; i--) {
            this.monsters[i].currentHp += this.monsters[i].res.maxHp * 0.2 * (GameData.instance.playerData.gameLevel - 1);
        }


        var self = this;
        this.scheduleOnce(function () { self.RealStartGame() }, 1);
    }

    RealStartGame() {

        this.isGaming = true;

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
                MainUI.instance.timeLabel.string = "剩余时间：" + this.currentTime.toFixed(0).toString();
                this.totalUpdateTime = 0;
            }

        }
    }

    EndGame() {

        this.isGaming = false;

        if (this.currentTime >= this.maxTime) {
            this.WinGame();
        }
        else if (this.monsters.length == 0) {
            this.WinGame();
        }
        else if (this.players.length == 0) {
            this.LoseGame();
        }

        var self = this;
        this.scheduleOnce(function () { self.StartGame() }, 2);

    }

    WinGame() {
        MainUI.instance.timeLabel.string = "胜利";
        console.log("player win");

        GameData.instance.playerData.gameLevel += 1;
        GameData.instance.playerData.gold += GameData.instance.playerData.gameLevel * 10;

        MainUI.instance.levelLabel.string = "关卡：" + GameData.instance.playerData.gameLevel.toString();
        MainUI.instance.goldLabel.string = GameData.instance.playerData.gold.toString();

        DbHelper.SetGameLevel();
        DbHelper.SetGold();
    }

    LoseGame() {
        MainUI.instance.timeLabel.string = "失败";

        GameData.instance.playerData.gold += GameData.instance.playerData.gameLevel * 3;

        MainUI.instance.goldLabel.string = GameData.instance.playerData.gold.toString();

        DbHelper.SetGold();

        console.log("player lose");
    }

    //#endregion

    //#region  grid

    @property(cc.Node)
    gridParent: cc.Node = null;

    @property(cc.Prefab)
    gridBlackPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    gridWhitePrefab: cc.Prefab = null;

    gridMaxX: number = 8;

    gridMaxY: number = 8;

    gridSize: number = 60;

    gridMap: { [key: string]: Grid; } = {};

    InitGird() {
        var black = false;
        for (var i = 0; i < this.gridMaxX; i++) {
            black = !black;
            for (var j = 0; j < this.gridMaxY; j++) {
                var key = cc.v2(i * this.gridSize, j * this.gridSize);
                var grid = new Grid();
                grid.position = key;
                this.gridMap[key.toString()] = grid;
                var gridUI: cc.Node = null;
                if (black) {
                    gridUI = cc.instantiate(this.gridBlackPrefab) as cc.Node;
                }
                else {
                    gridUI = cc.instantiate(this.gridWhitePrefab) as cc.Node;
                }

                gridUI.setParent(this.gridParent);

                gridUI.setPosition(key);

                gridUI.setContentSize(this.gridSize, this.gridSize);

                black = !black;
            }
        }
    }

    EnterGrid(role: Role, dest: cc.Vec2) {
        if (this.CanEnterGrid(dest)) {
            this.OutGrid(role);
            this.gridMap[dest.toString()].role = role;
            role.grid = this.gridMap[dest.toString()];
        }
    }

    OutGrid(role: Role) {
        if (role.grid) {
            this.gridMap[role.grid.position.toString()].role = null;
            role.grid = null;
        }
    }

    CanEnterGrid(key: cc.Vec2): boolean {
        var grid = this.gridMap[key.toString()];
        if (grid) {
            if (grid.role) {
                return false;
            }
            else {
                return true;
            }
        }
        return false;
    }

    //#endregion

    //#region  hudui

    @property(cc.Prefab)
    hudPrefab: cc.Prefab = null;

    hudUIPool: Array<cc.Label> = [];

    @property(cc.Node)
    hudUI: cc.Node = null;

    CreateHud(hp: number, pos: cc.Vec2) {
        var hud: cc.Label = null;
        if (this.hudUIPool.length > 0) {
            hud = this.hudUIPool.pop();
            hud.node.active = true;
        }
        else {
            hud = cc.instantiate(this.hudPrefab).getComponent(cc.Label);
            hud.node.setParent(this.hudUI);
        }


        hud.node.setPosition(pos.add(cc.v2(0, 50)));

        hud.getComponent(cc.Label).string = "-" + hp;

        var self = this;
        var finished = cc.callFunc(function () {
            self.hudUIPool.push(hud);
            hud.node.active = false;
        });

        var moveAction = cc.sequence(cc.moveTo(0.5, pos.add(cc.v2(0, 100))), finished);

        hud.node.runAction(moveAction);

    }

    //#endregion



}
