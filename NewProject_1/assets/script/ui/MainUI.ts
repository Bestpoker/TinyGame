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
export default class MainUI extends cc.Component {

    static instance: MainUI;

    @property(Number)
    uiLayer: number = 0;
    
    @property(cc.Label)
    tipLabel: cc.Label = null;

    @property(cc.Label)
    timeLabel: cc.Label = null;

    @property(cc.Label)
    levelLabel: cc.Label = null;

    @property(cc.Label)
    goldLabel: cc.Label = null;

    @property(cc.Button)
    roleBtn: cc.Button = null;

    @property(cc.Button)
    bagBtn: cc.Button = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        MainUI.instance = this;

        this.roleBtn.node.on('click', this.OnClickRoleBtn, this);
        this.bagBtn.node.on('click', this.OnClickBagBtn, this);
    }

    start () {

    }

    // update (dt) {}

    OnClickRoleBtn(btn: cc.Button){
        
    }

    OnClickBagBtn(btn: cc.Button){

    }

}
