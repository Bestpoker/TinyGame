import Monster from "./Monster";
import Role from "./Role";

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

    @property(cc.Node)
    battleField: cc.Node = null;

    @property(cc.Prefab)
    rolePrefab: cc.Prefab = null;

    allNodes: Array<cc.Node> = [];

    players: Array<Role> = [];

    monsters: Array<Role> = [];

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    }

    start() {

    }

    update(dt) {

        for (var i = 0; i < this.players.length; i++) {
            this.players[i].MyUpdate(dt);
        }

        for (var i = 0; i < this.monsters.length; i++) {
            this.monsters[i].MyUpdate(dt);
        }
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
                this.BornPlayer(1, cc.v2(0, -300));
                break;
            case cc.macro.KEY.x:
                this.BornMonster(1, cc.v2(0, 300));
                break;
        }
    }

    BornPlayer(resID: number, pos: cc.Vec2) {
        this.players.push(this.BornRole(resID, pos));
    }

    RemovePlayer(role: Role) {
        var index = this.players.indexOf(role);
        if (index > -1) {
            this.players.splice(index, 1);
        }

        this.RemoveRole(role);
    }

    BornMonster(resID: number, pos: cc.Vec2) {
        this.monsters.push(this.BornRole(resID, pos));
    }

    RemoveMonster(role: Role) {
        var index = this.monsters.indexOf(role);
        if (index > -1) {
            this.players.splice(index, 1);
        }

        this.RemoveRole(role);
    }

    BornRole(resID: number, pos: cc.Vec2): Role {
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
    }

}
