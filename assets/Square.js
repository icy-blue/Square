cc.Class({
    extends: cc.Component,

    properties: {

    },

    reuse() {
        cc.director.getScheduler().scheduleUpdate(this, 0, 0.2);
        this.gameJS = cc.find("Canvas").getComponent("Game");
    },

    update(dt) {
        // cc.log(1, this.node.getPosition());
        // cc.log(this.node.y);
    },

    canFall() {

    },

    onClear() {

    },

    init() {

    },

    onCollisionEnter(other, self) {
        if(other.node.parent == self.node.parent) {
            return;
        }
        // cc.log("onCollisionEnter");
        this.gameJS.checkClear();
        let selfBlockJS = self.node.parent.getComponent("Block");
        let otherBlockJS = other.node.parent.getComponent("Block");
        // cc.log(selfBlockJS.isFalling, otherBlockJS.isFalling);
        if(selfBlockJS.isFalling === true && otherBlockJS.isFalling === false) {
            cc.log("OK");
            if(selfBlockJS.collisionFlag === false) {
                selfBlockJS.speed *= -0.5;
                selfBlockJS.collisionFlag = true;
            } else {
                let flag = this.gameJS.connectBlock(self.node._parent, other.node._parent);
                cc.log("nana");
                if(flag === true) {
                    cc.log("aaa");
                    selfBlockJS.isFalling = false;
                    this.gameJS.isFalling = false;
                }
            }
        }
    }
});
