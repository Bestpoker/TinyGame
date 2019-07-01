import { JoystickType, DirectionType, SpeedType } from "./JoystickCommon";


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
export default class Joystick extends cc.Component {

  @property(cc.Node)
  dot = null;

  @property(cc.Node)
  ring = null;

  @property(cc.Node)
  player = null;

  @property({ type: cc.Enum(JoystickType) })
  joystickType = JoystickType.FIXED;

  @property({ type: cc.Enum(DirectionType) })
  directionType = DirectionType.ALL;

  @property(cc.Node)
  _stickPos = null;

  @property(cc.Node)
  _touchLocation = null;

  _radius: number = 0;

  p: cc.Vec2 = cc.Vec2.ZERO;


  // LIFE-CYCLE CALLBACKS:

  onLoad() {
    this._radius = this.ring.width / 2;
    this._initTouchEvent();
    // hide joystick when follow
    if (this.joystickType == JoystickType.FOLLOW) {
      this.node.opacity = 255;
    }
  }

  start() {

  }

  // update (dt) {}

  _initTouchEvent() {
    // set the size of joystick node to control scale
    const self = this;
    self.node.on(cc.Node.EventType.TOUCH_START, self._touchStartEvent, self);
    self.node.on(cc.Node.EventType.TOUCH_MOVE, self._touchMoveEvent, self);
    self.node.on(cc.Node.EventType.TOUCH_END, self._touchEndEvent, self);
    self.node.on(cc.Node.EventType.TOUCH_CANCEL, self._touchEndEvent, self);
  }

  _touchStartEvent(event) {
    const touchPos = this.node.convertToNodeSpaceAR(event.getLocation());

    if (this.joystickType === JoystickType.FIXED) {
      this._stickPos = this.ring.getPosition();

      // 触摸点与圆圈中心的距离
      const distance = touchPos.sub(this.ring.getPosition()).mag();

      // 手指在圆圈内触摸,控杆跟随触摸点
      if (this._radius > distance) {
        this.dot.setPosition(touchPos);
      }

    } else if (this.joystickType === JoystickType.FOLLOW) {

      // 记录摇杆位置，给 touch move 使用
      this._stickPos = touchPos;
      this.node.opacity = 255;
      this._touchLocation = event.getLocation();

      // 更改摇杆的位置
      this.ring.setPosition(touchPos);
      this.dot.setPosition(touchPos);
    }
  }

  _touchMoveEvent(event) {
    if (this.joystickType === JoystickType.FOLLOW) {
      // 如果 touch start 位置和 touch move 相同，禁止移动
      if (this._touchLocation === event.getLocation()) {
        return false;
      }
    }

    // 以圆圈为锚点获取触摸坐标
    const touchPos = this.ring.convertToNodeSpaceAR(event.getLocation());
    const distance = touchPos.mag();

    // 由于摇杆的 postion 是以父节点为锚点，所以定位要加上 touch start 时的位置
    const posX = this._stickPos.x + touchPos.x;
    const posY = this._stickPos.y + touchPos.y;

    // 归一化
    this.p = cc.v2(posX, posY).sub(this.ring.getPosition()).normalize();

    if (this._radius > distance) {
      this.dot.setPosition(cc.v2(posX, posY));

      this.player._speedType = SpeedType.NORMAL;
    } else {
      // 控杆永远保持在圈内，并在圈内跟随触摸更新角度
      const x = this._stickPos.x + this.p.x * this._radius;
      const y = this._stickPos.y + this.p.y * this._radius;
      this.dot.setPosition(cc.v2(x, y));

      this.player._speedType = SpeedType.FAST;
    }

    this.player = this.player.getComponent('Player');
    this.player.moveDir = this.p;
  }

  _touchEndEvent() {
    this.dot.setPosition(this.ring.getPosition());
    if (this.joystickType == JoystickType.FOLLOW) {
      this.node.opacity = 0;
    }
    this.player._speedType = SpeedType.STOP;
  }

  // methods

  setPlayerSpeed() {
    this.player = this.player.getComponent('Player');
    this.player.moveDir = this.p;
    this.player.speedType = SpeedType.NORMAL;
  }

}
