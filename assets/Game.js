/**
 * array shuffle
 * @author himself65
 */
Array.prototype.shuffle = function () {
  const randomNum = (l, r) => parseInt(Math.random() * (r - l + 1) + l, 10)
  for (let i = 0; i < this.length; ++i) {
    const p = randomNum(0, this.length - 1);
    const x = this[i];
    this[i] = this[p];
    this[p] = x;
  }
}
cc.Class({
    extends: cc.Component,

    properties: {
        initialSpeed: 100,
        maxSpeed: 1000,
        gravity: 980,
        squarePrefab: {
            type: cc.Prefab,
            default: null
        },
        initQuantity: 20,
        addQuantity: 5,
        initXPosition: 0,
        initYPosition: 0,
        squareSize: 72
    },

    onLoad() {
    	this.nowSquareNumber = 0;
        this.squarePool = new cc.nodePool();
        this.makeSquare(this.initQuantity);
	    this.directionX = new Array(0, 0, 1, -1);
	    this.directionY = new Array(1, -1, 0, 0);
    },
    
    /**
     * make squares
     * @param  {number} number square quantity
     */
    makeSquare(number) {
        for(let i = 1; i <= number; i++) {
            let square = cc.instantiate(this.squarePrefab);
            this.squarePool.put(square);
        }
    },

    /**
     * get squares
     * @return {cc.Node} the square node
     */
    getSquare(number) {
    	let squareArray = new Array();
    	for(let i = 1; i <= number; i++) {
	    	let square = this.squarePool.get();
	        if(square === null) {
	        	this.makeSquare(this.addQuantity);
	        	this.squarePool.get();
	        }
	        square.parent = this.node;
	        square.getComponent("Square").init();
	        this.nowSquareNumber++;
	        squareArray.push(square);
    	}
        return squareArray;
    },

    /**
     * clear the square
     * @param  {cc.Node} square 
     */
    clearSquare(square) {
        square.getComponent("Square").onclear();
    	this.squarePool.put(square);
    	this.nowSquareNumber--;
    },

    start () {
        
    },

    /**
     * judge sqare can connect which direction
     * @param  {cc.Node} square1 [description]
     * @param  {cc.Node} square2 [description]
     * @return {array}         direction array
     */
    canConnect(square1, square2) {
        let connectArray = new Array();
        for(let i = 0; i < 4; i++) {
            if(square1.dir[i] != undefined && 
                square2.dir[this.getOpposite(i)] != undefined) {
                connectArray.push(i);
            }
        }
        return connectArray;
    },

    /**
     * get the opposite direction
     * @param  {number} type [direction type]
     * @return {number}      [direction type]
     */
    getOpposite(type) {
        let oppositeDir = [2,1,4,3];
        if(type > 3 || type < 0) {
            cc.log("type error" + type);
        }
        return oppositeDir[type];
    },

    /**
     * connect the square
     * @param  {cc.Node} square1 the square 1
     * @param  {cc.Node} square2 the square 2
     */
    connectSquare(square1, square2) {
    	let connectArray = this.canConnect(square1, square2);
    	connectArray.shuffle();
    	let type = connectArray.pop();
    	if(type === undefined) {
    		return false;
    	} else {
    		let position = square1.getPosition();
    		let Xposition = position.x + squareSize * directionX[type];
    		let Yposition = position.y + squareSize * directionY[type];
    		square2.setPosition(Xposition, Yposition);
    		square1.dir[i] = square2;
            square2.dir[this.getOpposite(i)] = square1;
    	}
    },

    /**
     * make the ramdom shape
     * @param  {number} number square quantity
     */
    makeRandomShape(number) {
    	let squareArray = this.getSquare(number);
    	let baseSquare = squareArray.pop();
    	baseSquare.setPosition(this.initXPosition, this.initYPosition);
    	for(let i = 1; i < number; i++) {
    		let square = squareArray.pop();
    		this.connectSquare(baseSquare, square);
    		baseSquare = square;
    	}
    	
    },

    
    // update (dt) {},
});
