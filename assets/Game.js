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
        fallTime: 0.5,
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
	        	makeSquare(this.addQuantity);
	        	this.squarePool.get();
	        }
	        square.parent = this.node;
	        square.getComponent("Square").init();
	        this.nowSquareNumber++;
	        squareArray.push(square);
    	}
        return squareArray;
    },

    clearSquare(square) {
    	this.squarePool.put(square);
    	this.nowSquareNumber--;
    },

    start () {},

    /**
     * judge sqare can connect which direction
     * @param  {cc.Node} square1 [description]
     * @param  {cc.Node} square2 [description]
     * @return {array}         direction array
     */
    canConnect(square1, square2) {

    },

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
    		
    	}
    },

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
