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
        this.allNodes.push(role.node);
        return role;
    }

    RemoveRole(role: Role) {
        var index = this.allNodes.indexOf(role.node);
        if (index > -1) {
            this.allNodes.splice(index, 1);
        }
        role.node.destroy();
        Utils.RemoveRes(role.roleRes.resUrl);
        
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

        Utils.RemoveRes(magic.resName);

        magic.node.destroy();

    }

    //#endregion

    //#region  round

    maxRound: number = 4;

    currentRound: number = 0;

    currentTurn: TeamType = TeamType.Player;

    isGaming: boolean = false;

    StartGame() {
        this.isGaming = true;
        this.currentRound = 1;
        this.currentTurn = TeamType.Player;
        this.CreatePlayer(1, cc.v2(0, -300));
        this.CreateMonster(2, cc.v2(0, 300));
        this.UpdateRound();
    }

    EndGame() {
        if (this.currentRound >= this.maxRound && this.players.length > 0) {
            console.log("player win");
        }
        else if (this.monsters.length == 0) {
            console.log("player win");
        }
        else if (this.players.length == 0) {
            console.log("player lose");
        }
        this.isGaming = false;
        for (var i = this.players.length - 1; i >= 0; i--) {
            this.RemovePlayer(this.players[i]);
        }
        for (var i = this.monsters.length - 1; i >= 0; i--) {
            this.RemoveMonster(this.monsters[i]);
        }
    }

    UpdateRound() {
        this.currentRound++;
        if (this.currentRound > this.maxRound || this.players.length == 0 || this.monsters.length == 0) {
            this.EndGame();
        }

        if (this.currentTurn == TeamType.Player) {
            this.currentTurn = TeamType.Monster;
            for (var i = 0; i < this.players.length; i++) {
                this.players[i].UpdateRound();
            }
        }
        else if (this.currentTurn == TeamType.Monster) {
            this.currentTurn = TeamType.Player;
            for (var i = 0; i < this.monsters.length; i++) {
                this.monsters[i].UpdateRound();
            }
        }

    }

    EndRound() {
        if(this.isGaming){
            if (this.magics.length == 0) {
                this.UpdateRound();
            }
        }
    }

    //#endregion

}
