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
export default class Utils {

    static assetMap: { [key: string]: cc.Asset; } = {};
    // static assetCountMap: { [key:string]: number; } = {};

    static LoadRes(resName: string, type: typeof cc.Asset, completeCallback: (error: Error, resource: any) => void) {

        // if (Utils.assetCountMap[resName] == null) {
        //     Utils.assetCountMap[resName] = 0;
        // }
        // Utils.assetCountMap[resName]++;

        if (Utils.assetMap[resName] != null) {
            completeCallback(null, Utils.assetMap[resName]);
            return Utils.assetMap[resName];
        }

        cc.loader.loadRes(resName, type, function (err, asset) {
            if (err) {
                console.error("加载资源错误 " + err);
            }
            else {
                // if(Utils.assetCountMap[resName] > 0){
                Utils.assetMap[resName] = asset;
                completeCallback(err, asset);
                // }
                // else{
                //     cc.loader.release(resName);
                // }
            }
        });
    }

    // static RemoveRes(resName: string) {
    //     Utils.assetCountMap[resName]--;
    //     if (Utils.assetCountMap[resName] <= 0) {
    //         Utils.assetCountMap[resName] = 0;
    //         delete Utils.assetCountMap[resName];

    //         Utils.assetMap[resName] = null;
    //         delete Utils.assetMap[resName];


    //         var deps = cc.loader.getDependsRecursively(resName);
    //         if(deps){
    //             cc.loader.release(deps);
    //         }

    //         cc.sys.garbageCollect();
    //     }
    // }

    /**范围内获取整数随机数*/
    static GetRandomInt(min: number, max: number): number {
        var Range = max - min;
        var Rand = Math.random();
        return (min + Math.round(Rand * Range));
    }

    
    

    

}
