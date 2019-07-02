import Game from "./Game";

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

    @property(Number)
    moveSpeed: number = 0;

    @property(Number)
    flyTime: number = 0;

    life = 0;

    roleID = 0;

    teamID = 0;

    Init(){
        this.moveSpeed = 0;
        this.flyTime = 0;
        this.life = 0;
        this.roleID = 0;
        this.teamID = 0;
    }

    // onLoad () {
        
    // }

    start() {
        
    }

    update(dt) {

        if(this.life >= this.flyTime){
            Game.instance.DestroyBullet(this);
            return;
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

        this.life += dt;
    }

    onCollisionEnter(other: any, self: any) {
        console.log('on collision enter');

        Game.instance.DestroyBullet(this);
    
        // // 碰撞系统会计算出碰撞组件在世界坐标系下的相关的值，并放到 world 这个属性里面
        // var world = self.world;
    
        // // 碰撞组件的 aabb 碰撞框
        // var aabb = world.aabb;
    
        // // 节点碰撞前上一帧 aabb 碰撞框的位置
        // var preAabb = world.preAabb;
    
        // // 碰撞框的世界矩阵
        // var t = world.transform;
    
        // // 以下属性为圆形碰撞组件特有属性
        // var r = world.radius;
        // var p = world.position;
    
        // // 以下属性为 矩形 和 多边形 碰撞组件特有属性
        // var ps = world.points;
    }
}
