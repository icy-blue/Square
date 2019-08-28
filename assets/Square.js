cc.Class({
    extends: cc.Component,

    properties: {

    },

    reuse() {
        cc.director.getScheduler().scheduleUpdate(this, 0, 0.5);
        cc.director.getScheduler().resumeTarget(this);
        this.gameJS = cc.find("Canvas").getComponent("Game");
        this.node.on('touchstart', function (event) {
            this.touchUpdate(event);
        }, this);

        // this.node.on('touchend', this.touchEnd(), this);
        // this.node.on('touchcancel', this.touchEnd(), this);
    },

    /**
     * change the color
     *
     * @param      {cc.Color}  color   The color type
     */
    changeColor(color) {
        this.node.children[1].color = color;
    },

    touchUpdate(event) {
        let block = this.node.parent;
        cc.log(block.getComponent("Block").canMove === true);
        if(block.getComponent("Block").canMove === true) {
            let _x = block.getPosition().x;
            this.schedule(function() {
                if(block.getComponent("Block").canMove === false) {
                    this.touchEnd();
                }
                let deltax = event.getLocationX() - event.getStartLocation().x;
                let nowY = block.getPosition().y;
                block.setPosition(_x + deltax, nowY);
                this.gameJS.replaceBlock(block);
            }, 0.2);
        }
    },

    touchEnd() {
        this.unscheduleAllCallbacks();
    },

    update(dt) {

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
            cc.log("OK", selfBlockJS.collisionFlag);
            if(selfBlockJS.collisionFlag === false) {
                if(selfBlockJS.fallingSpeed > 0) {
                    selfBlockJS.fallingSpeed *= -this.gameJS.bounceRatio;
                }
                this.scheduleOnce(function() {
                    cc.log("exci");
                    selfBlockJS.collisionFlag = true;
                }, 0.01);
            } else {
                let flag = this.gameJS.connectBlock(self.node._parent, other.node._parent);
                cc.log("nana");
                if(flag === true) {
                    cc.log("aaa");
                    selfBlockJS.canMove = false;
                    selfBlockJS.isFalling = false;
                    this.gameJS.isFalling = null;
                }
            }
        }
    }
});
