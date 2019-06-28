
cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    start() {
        if(Math.random() > 0.5) {
            this.node.Color = cc.Color(60, 10, 185);
        }
        // let colorGreen = cc.Color(75, 205, 35);
        // let colorBlue = cc.Color(43, 169, 254);
        // let colorOrange = cc.Color(255, 124, 72);
        // let colorArray = new Array();
    },

    // update (dt) {},
});
