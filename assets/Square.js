cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    reuse() {
        this.gameJS = cc.find("Canvas").getComponent("Game");
        // cc.log(-1, this.node.getPosition());
        if(Math.random() > 0.5) {
            cc.log("lalala");
            this.node.color = cc.Color.RED;
        }
        // let colorGreen = cc.Color(75, 205, 35);
        // let colorBlue = cc.Color(43, 169, 254);
        // let colorOrange = cc.Color(255, 124, 72);
        // let colorArray = new Array();
        let manager = cc.director.getCollisionManager();
        // manager.enabled = true;
        manager.enabledDebugDraw = true;
        this.isFalling = true;
        this.speed = 0;
        this.CollisionFlag = false;
        cc.director.getScheduler().scheduleUpdate(this, 0, 0.2);
    },

    update(dt) {
        // cc.log(1, this.node.getPosition());
        if(this.isFalling) {
            this.speed += this.gameJS.gravity * dt;
            this.speed = Math.min(this.speed, this.gameJS.maxSpeed);
            this.node.y -= this.speed * dt;
            if(this.node.y <= -500) {
                this.isFalling = false;
            }
        }
        // cc.log(this.node.y);
    },

    onCollisionEnter(other, self) {
        cc.log("on Collision");
        // this.gameJS.checkClear();
        // if(this.CollisionFlag === false) {
        //     this.speed = -this.speed;
        //     this.CollisionFlag = true;
        // } else {
        //     this.isFalling = false;

        // }
    },

    canFall() {
        
    },

    onClear() {
        
    },

    init() {
        
    },

    
});
