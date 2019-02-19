import Monster from "./Monster";
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

    ID: number = 0;

    postion: cc.Vec2 = cc.Vec2.ZERO;

    role: Role = null;

}

@ccclass
export default class GameManager extends cc.Component {

    static instance: GameManager;

    //#region callback
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        GameManager.instance = this;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    start() {

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

    onKeyDown(event) {
        switch (event.keyCode) {
            case cc.macro.KEY.z:
                this.StartGame();
                break;
            case cc.macro.KEY.x:
                break;
        }
    }
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
        this.CreatePlayer(1, cc.v2(0, -300));
        this.CreateMonster(2, cc.v2(0, 300));
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
                this.totalUpdateTime = 0;
                this.currentTime -= this.totalUpdateTime;
                if (this.currentTime <= 0) {
                    this.currentTime = 0;
                }
                this.timeLabel.string = this.currentTime.toString();
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

    }

    //#endregion

    //#region  grid

    gridMap: { [key: string]: Grid; } = {};

    EnterGrid(role: Role, dest: cc.Vec2) {
        this.OutGrid(role);
        var gird = this.gridMap[dest.toString()];
        if (gird) {
            console.info("11");
            if(!gird.role){
                this.gridMap[dest.toString()].role = role;
                role.grid = gird;
            }
        }
        else{
            console.info("22");
        }
    }

    OutGrid(role: Role) {
        if (role.grid) {
            this.gridMap[role.grid.postion.toString()].role = null;
            role.grid = null;
        }
    }

    //#endregion

}
