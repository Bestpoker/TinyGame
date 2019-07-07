import Data from "./Data";
import Bullet from "./Bullet";
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
export default class Game extends cc.Component {

    public static instance: Game = null;

    @property(cc.Node)
    backGround: cc.Node = null;

    @property(cc.Node)
    tankParent: cc.Node = null;

    @property(cc.Node)
    bulletParent: cc.Node = null;

    @property(cc.Node)
    mainCamera: cc.Node = null;

    @property(cc.Node)
    bulletPrefab: cc.Node = null;

    @property(cc.Node)
    tankPrefab: cc.Node = null;

    @property(cc.Node)
    hitPrefab: cc.Node = null;

    player: Tank = null;

    allTanks: Tank[] = [];

    bulletPool: cc.Node[] = [];

    tankPool: cc.Node[] = [];


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Game.instance = this;
        Data.instance.mapMinX = this.backGround.width / 2;
        Data.instance.mapMinY = this.backGround.height / 2;

        cc.director.getCollisionManager().enabled = true;
    }

    start() {
        
        this.CreatePlayer();

        this.CreateEnemy();
        
    }

    // update (dt) {}



    lateUpdate() {
        Game.instance.mainCamera.position = this.player.node.position;
    }

    CreateBullet(): Bullet {

        var bullet: cc.Node = null;
        if (this.bulletPool.length > 0) {
            bullet = this.bulletPool.pop();
        }
        else {
            bullet = cc.instantiate(this.bulletPrefab);
        }

        bullet.active = true;
        bullet.setParent(this.bulletParent);

        var result = bullet.getComponent(Bullet);
        result.Init();
        return result;

    }

    DestroyBullet(bullet: Bullet) {
        bullet.isDead = true;
        bullet.node.active = false;
        this.bulletPool.push(bullet.node);
    }

    CreateTank(): Tank{
        var tank: cc.Node = null;
        if (this.tankPool.length > 0) {
            tank = this.tankPool.pop();
        }
        else {
            tank = cc.instantiate(this.tankPrefab);
        }

        tank.active = true;
        tank.setParent(this.tankParent);

        var result = tank.getComponent(Tank);
        result.Init();

        this.allTanks.push(result);

        return result;
    }

    DestroyTank(tank: Tank) {
        tank.isDead = true;
        tank.node.active = false;
        this.tankPool.push(tank.node);
        
        var index = this.allTanks.indexOf(tank);
        if (index > -1) {
            this.allTanks.splice(index, 1);
        }
    }

    CreatePlayer(){
        var player = this.CreateTank();
        player.node.position = cc.Vec2.ZERO;
        player.node.angle = 90;
        player.teamID = 1;
        player.roleID = 1;
        this.player = player;
    }

    CreateEnemy(){
        var enemy = this.CreateTank();
        enemy.node.position = cc.v2(0, 500);
        enemy.node.angle = 90;
        enemy.teamID = 2;
        enemy.roleID = 2;
        enemy.isAI = true;
    }


    
    SearchEnemyWithNearest(tank: Tank){
        this.allTanks.forEach(element => {
            if(element != tank){
                
            }
        });
    }



}
