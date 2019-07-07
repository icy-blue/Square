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
        cc.log("Collision");
        this.gameJS.checkClear();
        let selfBlockJS = self.node.getComponent("Block");
        let otherBlockJS = self.node.getComponent("Block");
        
    }

    
});
