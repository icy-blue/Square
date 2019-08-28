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
        blocks: {
            type: cc.Prefab,
            default: null
        },
        initQuantity: 20,
        addQuantity: 5,
        initXPosition: 0,
        initYPosition: 0,
        squareQuantityInBlocks: 4,
        squareSize: 72,
        eps: 1e-1,
        bounceRatio: 0.8
    },

    onLoad() {
    	this.nowSquareNumber = 0;
        this.squarePool = new cc.NodePool();
        this.makeSquare(this.initQuantity);
	    this.directionX = new Array(0, 0, 1, -1);
	    this.directionY = new Array(1, -1, 0, 0);
        this.isFalling = null;
        this.blockArray = new Array();
    },

    /**
     * make squares
     * @param  {number} number square quantity
     */
    makeSquare(number) {
        for(let i = 1; i <= number; i++) {
            let square = cc.instantiate(this.squarePrefab);
            square.dir = [];
            this.squarePool.put(square);
        }
    },

    /**
     * get squares
     * @return {cc.Node} the square node
     */
    getSquare(number, block) {
    	let squareArray = new Array();
    	for(let i = 1; i <= number; i++) {
	    	let square = this.squarePool.get();
	        if(square === null) {
	        	this.makeSquare(this.addQuantity);
	        	square = this.squarePool.get();
	        }
	        square.parent = block;
	        square.getComponent("Square").reuse();
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

    start() {

    },

    update(dt) {
        if(this.isFalling === null) {
            this.isFalling = this.makeRandomShape(this.squareQuantityInBlocks);
        }
    },

    checkClear() {

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
            if(square1.dir[i] == undefined &&
                square2.dir[this.getOpposite(i)] == undefined) {
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
        let oppositeDir = [1,0,3,2];
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
            cc.log("ERROR");
    		return false;
    	} else {
    		let position = square1.getPosition();
    		let Xposition = position.x + this.squareSize * this.directionX[type];
    		let Yposition = position.y + this.squareSize * this.directionY[type];
    		square2.setPosition(Xposition, Yposition);
    		square1.dir[type] = square2;
            square2.dir[this.getOpposite(type)] = square1;
    	}
        return type;
    },

    /**
     * make the ramdom shape
     * @param  {number} number square quantity
     */
    makeRandomShape(number) {
        let block = cc.instantiate(this.blocks);
        block.parent = this.node;
        block.setPosition(this.initXPosition, this.initYPosition);
    	let squareArray = this.getSquare(number, block);
    	let baseSquare = squareArray.pop();
        baseSquare.parent = block;
    	baseSquare.setPosition(0, 0);
        let blockJS = block.getComponent("Block");
        blockJS.son.push(baseSquare);
        let count = 0;
    	for(let i = 1; i < number; i++) {
    		let square = squareArray.pop();
    		let type = this.connectSquare(baseSquare, square);
            blockJS.dirType[type] ++;
            blockJS.son.push(square);
            let flag = false;
            if(Math.random() >= 0.8) {
                for(let i = 0; i < 4; i++) {
                    if(baseSquare.dir[i] === undefined) {
                        flag = true;
                    }
                }
            }
            if(flag === false) {
                baseSquare = square;
            }
    	}
        return block;
    },

    /**
     * replace the block
     * @param  {cc.Node} block the block node
     */
    replaceBlock(block) {
        let pos = Math.ceil((block.x + 360) / this.squareSize + 0.5) - 0.5;
        block.x = pos * this.squareSize - 360;
    },

    /**
     * get every position in the block
     * @param  {cc.Node} block
     * @return {Array}   the position array
     */
    getMapPos(block) {
        let squareArray = block.getComponent("Block").son;
        let arrayLength = squareArray.length;
        let posArray = [];
        for(let i = 0; i < arrayLength; i++) {
            let posX = (block.x + squareArray[i].x + 360) / this.squareSize + 0.5;
            let posY = (block.y + squareArray[i].y + 640) / this.squareSize + 0.5;
            posArray.push(cc.v2(posX, posY));
        }
        return posArray;
    },

    /**
     * connect the block
     * @param  {cc.Node} blockA the block A
     * @param  {cc.Node} blockB the block B
     */
    connectBlock(blockA, blockB) {
        let flag = false;
        // this.replaceBlock(blockA);
        // this.replaceBlock(blockB);
        let posArrayA = this.getMapPos(blockA);
        let posArrayB = this.getMapPos(blockB);
        let squareArrayA = blockA.getComponent("Block").son;
        let squareArrayB = blockB.getComponent("Block").son;
        let arrayLengthA = posArrayA.length;
        let arrayLengthB = posArrayB.length;
        cc.log(posArrayA, posArrayB);
        for(let j = 0; j < arrayLengthA; j++) {
            for(let k = 0; k < arrayLengthB; k++) {
                for(let i = 0; i < 4; i++) {
                    if(Math.abs(posArrayB[k].x - posArrayA[j].x - this.directionX[i]) <= this.eps
                        && Math.abs(posArrayB[k].y - posArrayA[j].y - this.directionY[i]) <= this.eps) {
                        let oppositeDir = this.getOpposite(i);
                        squareArrayA[j].dir[i] = squareArrayB[k];
                        squareArrayB[k].dir[oppositeDir] = squareArrayA[j];
                        flag = true;
                    }
                }
            }
        }
        return flag;
    }
});
