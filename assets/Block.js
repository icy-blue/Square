
cc.Class({
    extends: cc.Component,

    properties: {

    },

    onLoad() {
        this.gameJS = cc.find("Canvas").getComponent("Game");
        let manager = cc.director.getCollisionManager();
        manager.enabled = true;
        // manager.enabledDebugDraw = true;
        this.isFalling = true;
        this.fallingSpeed = 0;
        this.collisionFlag = false;
        this.dirType = [];
        for(let i = 0; i < 4; i++) {
            this.dirType[i] = 0.5;
        }
        this.son = new Array();
    },

    update(dt) {
        // cc.log(this.node.y);
        if(this.isFalling) {
            this.fallingSpeed += this.gameJS.gravity * dt;
            this.fallingSpeed = Math.min(this.fallingSpeed, this.gameJS.maxSpeed);
            this.node.y -= this.fallingSpeed * dt;
            if(this.node.y <= -640 + this.dirType[1] * this.gameJS.squareSize) {
                this.isFalling = false;
                this.gameJS.isFalling = false;
            }
        }
        // if(this.isMove) {
            
        // }
    },

});
