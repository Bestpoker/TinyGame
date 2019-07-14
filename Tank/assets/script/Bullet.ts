import Game from "./Game";
import Tank from "./Tank";
import GameItem from "./GameItem";

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
export default class Bullet extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    @property(cc.RigidBody)
    rigbody: cc.RigidBody = null;

    private moveSpeed: number = 0;

    private attackRange: number = 0;

    private life = 0;

    private maxFlyTime = 0;

    attackHp = 0;

    roleID = 0;

    teamID = 0;

    isDead = false;

    angleDirty = false;

    lineVec: cc.Vec2;

    Init() {
        this.moveSpeed = 0;
        this.attackRange = 0;
        this.life = 0;
        this.maxFlyTime = 0;
        this.roleID = 0;
        this.teamID = 0;
        this.isDead = false;
        this.attackHp = 0;
        this.angleDirty = false;
        this.lineVec = cc.Vec2.ZERO;
    }

    // onLoad () {

    // }

    start() {

    }

    update(dt) {

        if (this.isDead) {
            return;
        }

        if (this.life >= this.maxFlyTime) {
            Game.instance.DestroyBullet(this);
            return;
        }

        this.life += dt;

        if (this.angleDirty) {
            this.angleDirty = false;
            var dir = this.rigbody.linearVelocity.normalize();
            this.rigbody.linearVelocity = cc.v2(dir.x * this.moveSpeed, dir.y * this.moveSpeed);

            this.SetAngle();
        }

        // if (this.life > this.maxFlyTime) {
        //     dt = dt - (this.life - this.maxFlyTime);
        //     this.life = this.maxFlyTime;
        // }

        // //由于Math函数接受的是孤度，所以我们先节节点的旋转转化为弧度
        // var angle = this.node.angle / 180 * Math.PI;
        // //合成基于 X正方向的方向向量
        // var dir = cc.v2(Math.cos(angle), Math.sin(angle));
        // //单位化向量
        // dir.normalizeSelf();

        // //根据方向向量移动位置
        // this.node.x += dt * dir.x * this.moveSpeed;
        // this.node.y += dt * dir.y * this.moveSpeed;


    }

    // onCollisionEnter(other: any, self: any) {
    //     // console.log('on collision enter');

    //     var otherTank = other.getComponent(Tank) as Tank;
    //     if (otherTank != null) {
    //         if (otherTank.roleID != this.roleID) {
    //             otherTank.BeAttacked(this.attackHp);
    //             Game.instance.DestroyBullet(this);
    //             return;
    //         }
    //     }

    //     var otherGameItem = other.getComponent(GameItem) as GameItem;
    //     if (otherGameItem != null) {
    //         otherGameItem.BeAttacked(this.attackHp);
    //         Game.instance.DestroyBullet(this);
    //         return;
    //     }

    // }

    SetInfo(attackRange: number, moveSpeed: number, attackHp: number) {
        this.moveSpeed = moveSpeed;
        this.attackRange = attackRange;
        this.maxFlyTime = attackRange / moveSpeed;
        this.attackHp = attackHp;
    }

    SetAngle() {
        if (this.rigbody.linearVelocity.x != 0 || this.rigbody.linearVelocity.y != 0) {
            var angle = this.rigbody.linearVelocity.signAngle(cc.v2(1, 0));

            var degree = angle / Math.PI * 180;
            this.node.angle = -degree;
        }

    }

    SetVelocity(vec: cc.Vec2) {
        this.rigbody.linearVelocity = vec;
        this.lineVec = vec;
    }

    onBeginContact(contact: cc.PhysicsContact, selfCollider: cc.PhysicsBoxCollider, otherCollider: cc.PhysicsBoxCollider) {
        this.angleDirty = true;

        var otherTank = otherCollider.getComponent(Tank) as Tank;
        if (otherTank != null) {
            if (otherTank.roleID != this.roleID) {
                otherTank.BeAttacked(this.attackHp);
                Game.instance.DestroyBullet(this);
                return;
            }
        }

        if(otherCollider.node.name == "GroundBoxCollider"){
            Game.instance.DestroyBullet(this);
        }
    }
}
