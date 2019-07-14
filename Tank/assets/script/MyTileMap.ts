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
export default class MyTileMap extends cc.Component {

    @property(cc.TiledMap)
    myTileMap: cc.TiledMap = null;

    @property(cc.Node)
    colliderPrefab: cc.Node = null;

    @property(cc.Node)
    colliderParent: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        var layer = this.myTileMap.getLayer("block");
        var mapSize = layer.getLayerSize();
        var tileSize = layer.getMapTileSize();

        for (let y = 0; y < mapSize.height; y++) {
            for (let x = 0; x < mapSize.width; x++) {
                if(layer.getTileGIDAt(cc.v2(x, y)) == 0){
                    continue;
                }
                var node = cc.instantiate(this.colliderPrefab);
                node.active = true;
                node.setParent(this.colliderParent);
                node.position = cc.v2(x * tileSize.width, (mapSize.height - 1 - y) * tileSize.height);
                var collider = node.getComponent(cc.PhysicsBoxCollider);
                collider.size = tileSize;
                collider.offset = cc.v2(tileSize.width / 2, tileSize.height / 2);
            }
        }

    }

    start() {

    }

    // update (dt) {}
}
