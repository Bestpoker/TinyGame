import { JoystickType } from "./JoystickCommon";
import Joystick from "./Joystick";
import Player from "./Player";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class UI extends cc.Component {

    public static instance: UI = null;

    @property(Joystick)
    joystick: Joystick = null;

    @property(cc.Button)
    shootBtn: cc.Button = null;

    @property(Player)
    player: Player = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        UI.instance = this;

        this.joystick.player = this.player;

        var clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.player.node; //这个 node 节点是你的事件处理代码组件所属的节点，这里就是Button2
        clickEventHandler.component = "Player";//这个是脚本文件名
        clickEventHandler.handler = "CreateBullet"; //回调函名称
        clickEventHandler.customEventData = ""; //用户数据
        this.shootBtn.clickEvents.push(clickEventHandler);
    }

    start () {

    }

    // update (dt) {}

    useFixedType () {
		this.joystick.joystickType = JoystickType.FIXED;
		this.joystick.node.opacity = 255;
	}

	useFollowType () {
		this.joystick.joystickType = JoystickType.FOLLOW;
		this.joystick.node.opacity = 0;
	}
}
