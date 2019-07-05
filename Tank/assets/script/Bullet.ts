import Game from "./Game";
import Tank from "./Tank";

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

    private moveSpeed: number = 0;

    private attackRange: number = 0;

    private life = 0;

    private maxFlyTime = 0;

    roleID = 0;

    teamID = 0;

    isDead = false;

    Init(){
        this.moveSpeed = 0;
        this.attackRange = 0;
        this.life = 0;
        this.maxFlyTime = 0;
        this.roleID = 0;
        this.teamID = 0;
        this.isDead = false;
    }

    // onLoad () {
        
    // }

    start() {
        
    }

    update(dt) {

        if(this.isDead){
            return;
        }

        if(this.life >= this.maxFlyTime){
            Game.instance.DestroyBullet(this);
            return;
        }

        this.life += dt;

        if(this.life > this.maxFlyTime){
            dt = dt - (this.life - this.maxFlyTime);
            this.life = this.maxFlyTime;
        }

        //由于Math函数接受的是孤度，所以我们先节节点的旋转转化为弧度
        var angle = this.node.angle / 180 * Math.PI;
        //合成基于 X正方向的方向向量
        var dir = cc.v2(Math.cos(angle), Math.sin(angle));
        //单位化向量
        dir.normalizeSelf();

        //根据方向向量移动位置
        this.node.x += dt * dir.x * this.moveSpeed;
        this.node.y += dt * dir.y * this.moveSpeed;

        
    }

    onCollisionEnter(other: any, self: any) {
        // console.log('on collision enter');

        if(this.isDead){
            return;
        }

        var otherPlayer = other.getComponent(Tank);
        if(otherPlayer != null){
            if(otherPlayer.roleID != this.roleID){
                Game.instance.DestroyBullet(this);
                return;
            }
        }
        
    }

    SetInfo(attackRange: number, moveSpeed: number){
        this.moveSpeed = moveSpeed;
        this.attackRange = attackRange;
        this.maxFlyTime = attackRange / moveSpeed;
    }
}
