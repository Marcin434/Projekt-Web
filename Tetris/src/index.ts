const startButton:HTMLElement = document.querySelector("#start");
const canvas: HTMLCanvasElement = document.querySelector("#canvas");

class Block{

  color: string;
  position: BlockPosition;
  shape: number[][];

  constructor(color: string, position: BlockPosition, shape: number[][]){
    this.color = color
    this.position = position
    this.shape = shape
  }
  
    getPosition(position: Position){
    return this.position
  }

}

class BlockPosition{
  x: number
  y: number
}

enum GameState{
  stop = "Stop",
  game = "Game",
  pause = "Pause"
}


class App{
  boardWidth: number = 200
  boardHeight: number = 400

  initialize(){
    let gameCanvas = new GameCanvas(canvas, this.boardWidth, this.boardHeight);
    let gameLoop = new GameLoop(gameCanvas, this.boardWidth, this.boardHeight);
    startButton.addEventListener("click", () => {this.onStart(gameLoop)});
    document.addEventListener("keypress", (key) => {this.onKeyPress(key, gameLoop)});

  }

  onStart(gameLoop: GameLoop){
    startButton.innerHTML = "Restart"
    gameLoop.start()
  }
  onKeyPress(key:KeyboardEvent, gameLoop: GameLoop){
    if(key.keyCode == 97){
      gameLoop.moveLeft()
    }else if(key.keyCode == 100){
      gameLoop.moveRight()
    }
    
  }

}

class GameCanvas{

  canvas:HTMLCanvasElement
  ctx:CanvasRenderingContext2D

  constructor(canvas: HTMLCanvasElement, width: number, height: number){
    this.canvas = canvas
    this.initialize(width, height)

  }

  initialize(width: number, height: number){
    this.ctx = canvas.getContext('2d')
    this.ctx.canvas.width = width
    this.ctx.canvas.height = height
  }

  drawBlock(block: Block){
    for(let i = 0; i<block.shape.length;i++){
      for(let j = 0; j<block.shape.length; j++){
        if(block.shape[j][i]!= 0){
          this.ctx.fillStyle = "#00FF00"
          this.ctx.fillRect((i+block.position.x) * 20, (j + Math.round(block.position.y))* 20, 20, 20)
        }
      }
    }
  }

  drawBoard(boardMatrix: string[][]){
    for(let i = 0; i<10;i++){
      for(let j = 0; j<20; j++){
        if(boardMatrix[j][i] == "0"){
          this.ctx.fillStyle ="#FFFFFF"
          this.ctx.fillRect(i * 20 , j * 20, 20, 20)
          
        }else{
          this.ctx.fillStyle = "#00FF00"
          this.ctx.fillRect(i * 20 , j * 20, 20, 20)
          
        }
      }
    }
    
  }
  updateBoard(block: Block, boardMatrix: string[][], activeBlock?: Block){
    
    this.drawBoard(boardMatrix)
    this.drawBlock(block)

  }
}

class GameLoop{
  readonly blockSpeed: number = 0.05
  gameCanvas: GameCanvas;
  boardMatrix: string[][]
  boardWidth: number
  boardHeight: number
  activeBlock: Block

  gameState: GameState = GameState.stop

  constructor(gameCanvas: GameCanvas, boardWidth: number, boardHeight: number){
    this.gameCanvas = gameCanvas
    this.boardWidth = boardWidth
    this.boardHeight = boardHeight
  }

  start(){
    this.boardMatrix = new Array
    this.boardMatrix = [
      ["0","0","0","0","0","0","0","0","0","0",],
      ["0","0","0","0","0","0","0","0","0","0",],
      ["0","0","0","0","0","0","0","0","0","0",],
      ["0","0","0","0","0","0","0","0","0","0",],
      ["0","0","0","0","0","0","0","0","0","0",],
      ["0","0","0","0","0","0","0","0","0","0",],
      ["0","0","0","0","0","0","0","0","0","0",],
      ["0","0","0","0","0","0","0","0","0","0",],
      ["0","0","0","0","0","0","0","0","0","0",],
      ["0","0","0","0","0","0","0","0","0","0",],
      ["0","0","0","0","0","0","0","0","0","0",],
      ["0","0","0","0","0","0","0","0","0","0",],
      ["0","0","0","0","0","0","0","0","0","0",],
      ["0","0","0","0","0","0","0","0","0","0",],
      ["0","0","0","0","0","0","0","0","0","0",],
      ["0","0","0","0","0","0","0","0","0","0",],
      ["0","0","0","0","0","0","0","0","0","0",],
      ["0","0","0","0","0","0","0","0","0","0",],
      ["0","0","0","0","0","0","0","0","0","0",],
      ["0","0","0","0","0","0","0","0","0","0",],
    ]

    this.activeBlock =this.getRandomBlock();
    this.activeBlock.shape.length
    this.loop();

  }

  loop(){
    setInterval(() =>{
    if(this.canMoveDown()){
        this.moveBlock()

    }else{
      this.activeBlock = this.getRandomBlock()

    }

    this.gameCanvas.updateBoard(this.activeBlock, this.boardMatrix)
    
  }, 16)
  }

  getRandomBlock(){
    let pos:BlockPosition = new BlockPosition
    pos.y = 0
    pos.x = 4
    let b = new Block("#0000FF", pos,this.getRandomShape());
    return b
  }
  moveBlock(){
    this.activeBlock.position.y += this.blockSpeed;
  }

  canMoveDown(): boolean{
    

    for(let i = 0; i<this.activeBlock.shape.length;i++){
      for(let j = 0; j<this.activeBlock.shape.length; j++){
        if(this.activeBlock.shape[j][i]!= 0 && i+this.activeBlock.position.y > 20){
          for(let i = 0; i<this.activeBlock.shape.length;i++){
            for(let j = 0; j<this.activeBlock.shape.length; j++){
              if(this.activeBlock.shape[j][i]!= 0){
                this.boardMatrix[j+Math.round(this.activeBlock.position.y)][i+this.activeBlock.position.x] = "1";
    
              }
            }
          }          
          return false
        }

        if(this.activeBlock.shape[j][i]!= 0 && this.boardMatrix[j+Math.round(this.activeBlock.position.y)][i+this.activeBlock.position.x] != "0"){
          for(let i = 0; i<this.activeBlock.shape.length;i++){
            for(let j = 0; j<this.activeBlock.shape.length; j++){
              if(this.activeBlock.shape[j][i]!= 0){
                this.boardMatrix[j+Math.round(this.activeBlock.position.y)-1][i+this.activeBlock.position.x] = "1";
    
              }
            }
          }
          return false
        }
      }
    }
    return true
  }

  moveLeft(){
    this.activeBlock.position.x--
  }

  moveRight(){
    this.activeBlock.position.x++
  }

  setGameState(newState: GameState){
    
    if(newState == GameState.game){
      startButton.innerHTML = "Pause";
    }else if(newState == GameState.pause){
      startButton.innerHTML = "Stop";
    }else{
      startButton.innerHTML = "Start";
    }
    this.gameState = newState
  }

  getRandomShape(): number[][]{
    let r = Math.round(Math.random()*6)
    switch(r){
    case 0: 
      return [
      [0,1,0,0],
      [0,1,0,0],
      [0,1,0,0],
      [0,1,0,0]
    ]
      case 1:
      return [
      [1,1,1],
      [1,0,0],
      [0,0,0]
    ]
    case 2:
      return [
      [1,1,1],
      [0,0,1],
      [0,0,0]
    ]
    case 3:
      return [
      [1,1,0],
      [1,1,0],
      [0,0,0]
    ]
    case 4:
      return [
      [1,1,0],
      [0,1,1],
      [0,0,0]
    ]
    case 5:
      return [
      [0,1,1],
      [1,1,0],
      [0,0,0]
    ]
    case 6:
    return [
      [1,1,1],
      [0,1,0],
      [0,0,0]
    ]
    }
  }
  getRandomColor(): string{
    let color = Math.floor(Math.random()*16777215).toString(16);

    return "#"+color
  }
  
}

const app = new App

app.initialize();
