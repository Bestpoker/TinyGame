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
export default class NewClass extends cc.Component {

    @property(Monster)
    pig: Monster;

    @property(Role)
    role: Role;

    Nodes: Array<cc.Node> = [];

    Monsters: Array<Monster> = [];

    Roles: Array<Role> = [];

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.Nodes.push(this.role.node);
        this.Nodes.push(this.pig.node);

        this.Roles.push(this.role);
        this.Monsters.push(this.pig);

        this.role.SetTarget(this.pig);
    }

    update(dt) {

        for (var i = 0; i < this.Roles.length; i++) {
            this.Roles[i].MyUpdate(dt);
        }

        for (var i = 0; i < this.Monsters.length; i++) {
            this.Monsters[i].MyUpdate(dt);
        }
    }

    lateUpdate(){
        this.Nodes = this.Nodes.sort((n1,n2) => {
            if(n1.y < n2.y) {
                return 1;
            }
            else if(n1.y > n2.y) {
                return -1;
            }
            return 0;
        });

        for (var i = 0; i < this.Nodes.length; i++) {
            this.Nodes[i].setSiblingIndex(i);
        }
    }
}
