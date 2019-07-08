import Data from "./Data";
import Bullet from "./Bullet";
import Tank from "./Tank";
import { MyNodeList } from "./MyNodeList";
import GameItem from "./GameItem";
import Entity from "./Entity";

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

    @property(cc.Node)
    gameItemPrefab: cc.Node = null;

    player: Tank = null;

    allTanks: Tank[] = [];

    bulletPool: cc.Node[] = [];

    tankPool: cc.Node[] = [];

    allGameItems: GameItem[] = [];

    gameItemPool: cc.Node[] = [];

    // tankNodeList: MyNodeList<Tank> = new MyNodeList<Tank>();


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Game.instance = this;
        Data.instance.mapMinX = this.backGround.width / 2;
        Data.instance.mapMinY = this.backGround.height / 2;

        cc.director.getCollisionManager().enabled = true;
    }

    start() {

        this.CreatePlayer();

        // this.CreateEnemy();

        this.CreateItem();

    }

    // update (dt) {}



    lateUpdate() {
        Game.instance.mainCamera.position = this.player.node.position;

        // this.tankNodeList.print();
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

    CreateTank(): Tank {
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

        // this.tankNodeList.add(result);

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

    CreatePlayer() {
        var player = this.CreateTank();
        player.node.position = cc.Vec2.ZERO;
        player.node.angle = 90;
        player.teamID = 1;
        player.roleID = 1;
        player.maxHp = 100;

        this.player = player;
    }

    CreateEnemy() {
        for (let index = 0; index < 50; index++) {
            var enemy = this.CreateTank();
            enemy.node.position = cc.v2(100 * (-25 + index), 100 * (-25 + index));
            enemy.node.angle = 90;
            enemy.teamID = index + 2;
            enemy.roleID = index + 2;
            enemy.isAI = true;
            enemy.maxHp = 10;
        }
    }

    CreateItem() {
        // for (let index = 0; index < 50; index++) {
        //     var gameItem = this.CreateGameItem();
        //     gameItem.node.position = cc.v2(100 * (-25 + index), 100 * (25 - index));
        //     gameItem.node.angle = 0;
        //     gameItem.maxHp = 20;
        // }

        var gameItem = this.CreateGameItem();
            gameItem.node.position = cc.v2(0, 800);
            gameItem.node.angle = 0;
            gameItem.maxHp = 20;

            var gameItem = this.CreateGameItem();
            gameItem.node.position = cc.v2(0, 1000);
            gameItem.node.angle = 0;
            gameItem.maxHp = 20;

            var gameItem = this.CreateGameItem();
            gameItem.node.position = cc.v2(0, 1200);
            gameItem.node.angle = 0;
            gameItem.maxHp = 20;

            var gameItem = this.CreateGameItem();
            gameItem.node.position = cc.v2(0, 1400);
            gameItem.node.angle = 0;
            gameItem.maxHp = 20;

            var gameItem = this.CreateGameItem();
            gameItem.node.position = cc.v2(0, 1600);
            gameItem.node.angle = 0;
            gameItem.maxHp = 20;

            var gameItem = this.CreateGameItem();
            gameItem.node.position = cc.v2(0, 1800);
            gameItem.node.angle = 0;
            gameItem.maxHp = 20;

            var gameItem = this.CreateGameItem();
            gameItem.node.position = cc.v2(0, 500);
            gameItem.node.angle = 0;
            gameItem.maxHp = 20;

    }

    CreateGameItem(): GameItem {
        var gameItem: cc.Node = null;
        if (this.gameItemPool.length > 0) {
            gameItem = this.gameItemPool.pop();
        }
        else {
            gameItem = cc.instantiate(this.gameItemPrefab);
        }

        gameItem.active = true;
        gameItem.setParent(this.tankParent);

        var result = gameItem.getComponent(GameItem);
        result.Init();

        this.allGameItems.push(result);

        return result;
    }

    DestroyGameItem(gameItem: GameItem) {
        gameItem.isDead = true;
        gameItem.node.active = false;
        this.gameItemPool.push(gameItem.node);

        var index = this.allGameItems.indexOf(gameItem);
        if (index > -1) {
            this.allGameItems.splice(index, 1);
        }
    }

    SearchEnemyWithNearest(tank: Tank): Entity {
        var tankTarget: Entity = null;
        var tankDis = -1;

        this.allTanks.forEach(element => {
            if (element != tank && !element.isDead) {
                var tempDis = element.node.position.sub(tank.node.position).mag();
                if (tankDis == -1) {
                    tankTarget = element;
                    tankDis = tempDis;
                }
                else {
                    if (tempDis < tankDis) {
                        tankTarget = element;
                        tankDis = tempDis;
                    }
                }
            }
        });

        var gameItemTarget: Entity = null;
        var gameItemDis = -1;

        this.allGameItems.forEach(element => {
            if (!element.isDead) {
                var tempDis = element.node.position.sub(tank.node.position).mag();
                if (gameItemDis == -1) {
                    gameItemTarget = element;
                    gameItemDis = tempDis;
                }
                else {
                    if (tempDis < gameItemDis) {
                        gameItemTarget = element;
                        gameItemDis = tempDis;
                    }
                }
            }
        });

        if(gameItemTarget != null){
            if(tankDis <= tank.bulletAttackRange){
                return tankTarget;
            }
            else{
                return gameItemTarget;
            }
        }
        else{
            return gameItemTarget;
        }
    }



}
