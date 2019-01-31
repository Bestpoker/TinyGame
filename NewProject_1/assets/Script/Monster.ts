// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

enum Direction {
    None,
    Up,
    Down,
    Left,
    Right
};

const {ccclass, property} = cc._decorator;

@ccclass
export default class Monster extends cc.Component {

    @property(cc.Float)
    speed = 50;

    @property(cc.Animation)
    ani: cc.Animation = null;
    

    dir: Direction = Direction.None;

    nextDir: Direction = Direction.Up;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        
        this.RunLeft();
    }

    // update (dt) {}


    Run(dt: any) {

        if(this.nextDir == Direction.Up){
            if(this.node.position.x <= -150){
                this.RunUp();
                this.nextDir = Direction.Right;
            }
        }
        else if(this.nextDir == Direction.Right){
            if(this.node.position.y >= 150){
                this.RunRight();
                this.nextDir = Direction.Down;
            }
        }
        else if(this.nextDir == Direction.Down){
            if(this.node.position.x >= 150){
                this.RunDown();
                this.nextDir = Direction.Left;
            }
            
        }
        else if(this.nextDir == Direction.Left){
            if(this.node.position.y <= -150){
                this.RunLeft();
                this.nextDir = Direction.Up;
            }
            
        }

        
    }

    RunLeft(){
        if (this.dir != Direction.Left){
            this.dir = Direction.Left;
            this.node.stopAllActions();
            var dest: cc.Vec2 = new cc.Vec2(-270, this.node.y);
            var cha = Math.abs(dest.x - this.node.x);
            var time = cha / this.speed;
            var action = cc.moveTo(time, dest);
            this.node.runAction(action);
            this.ani.play("left");
        }
    }

    RunRight(){
        if (this.dir != Direction.Right){
            this.dir = Direction.Right;
            this.node.stopAllActions();
            var dest: cc.Vec2 = new cc.Vec2(270, this.node.y);
            var cha = Math.abs(dest.x - this.node.x);
            var time = cha / this.speed;
            var action = cc.moveTo(time, dest);
            this.node.runAction(action);
            this.ani.play("right");
        }
        
    }

    RunUp(){
        if (this.dir != Direction.Up){
            this.dir = Direction.Up;
            this.node.stopAllActions();
            var dest: cc.Vec2 = new cc.Vec2(this.node.x, 480);
            var cha = Math.abs(dest.y - this.node.y);
            var time = cha / this.speed;
            var action = cc.moveTo(time, dest);
            this.node.runAction(action);
            this.ani.play("up");
        }
        
    }

    RunDown(){
        if (this.dir != Direction.Down){
            this.dir = Direction.Down;
            this.node.stopAllActions();
            var dest: cc.Vec2 = new cc.Vec2(this.node.x, -480);
            var cha = Math.abs(dest.y - this.node.y);
            var time = cha / this.speed;
            var action = cc.moveTo(time, dest);
            this.node.runAction(action);
            this.ani.play("down");
        }
        
    }

    
}
