cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    reuse() {
        cc.director.getScheduler().scheduleUpdate(this, 0, 0.2);
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

    
});
