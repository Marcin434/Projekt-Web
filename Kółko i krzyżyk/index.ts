let p1ScoreBoard = document.querySelector("#score1");
let p2ScoreBoard = document.querySelector("#score2");

let p1Score = 0;
let p2Score = 0;

class Board{

    cells: Cell[] = new Array();
    playerTurn: number = 1;
    moves : number = 0;

    DrawBoard(id: string){
        let board = document.querySelector(id);
        board.innerHTML = "";
        this.cells = new Array();

        for(let i = 0; i < 9; i++){
          
          let cellDiv = document.createElement("div");
          let c = new Cell(cellDiv, this);

          c.cellDiv.className = "c" + i;

          cellDiv.addEventListener("click", c.PlaceMark.bind(c));
          
          this.cells.push(c);
          board.appendChild(cellDiv);
        }
    }

    CurrentPlayer(){
        if(this.playerTurn == 1){
          this.playerTurn = 2
        }else{
          this.playerTurn = 1
        }
        this.moves++;
    }

    GameOver(){
        let player;

        if(this.moves > 8){
          alert("Draw");
          this.NewGame();
        }

        if(this.playerTurn == 1){
          player = "X";
        }else{
          player = "O";
        }

        if (
          this.cells[0].mark == this.cells[1].mark &&
          this.cells[1].mark == this.cells[2].mark &&
          this.cells[0].mark ==  player ||
          this.cells[3].mark == this.cells[4].mark &&
          this.cells[4].mark == this.cells[5].mark &&
          this.cells[3].mark ==  player ||
          this.cells[6].mark == this.cells[7].mark &&
          this.cells[7].mark == this.cells[8].mark &&
          this.cells[6].mark ==  player ||
          this.cells[0].mark == this.cells[3].mark &&
          this.cells[3].mark == this.cells[6].mark &&
          this.cells[0].mark ==  player ||
          this.cells[1].mark == this.cells[4].mark &&
          this.cells[4].mark == this.cells[7].mark &&
          this.cells[1].mark ==  player ||
          this.cells[2].mark == this.cells[5].mark &&
          this.cells[5].mark == this.cells[8].mark &&
          this.cells[2].mark ==  player ||
          this.cells[0].mark == this.cells[4].mark &&
          this.cells[4].mark == this.cells[8].mark &&
          this.cells[0].mark ==  player ||
          this.cells[2].mark == this.cells[4].mark &&
          this.cells[4].mark == this.cells[6].mark &&
          this.cells[2].mark ==  player){

          alert("Player " + this.playerTurn + " won");

          if(player == "X"){
            p1Score++;
          }else{
            p2Score++;
          }

          this.NewGame();
        }
    }

    private NewGame() {
        p1ScoreBoard.innerHTML = "" + p1Score;
        p2ScoreBoard.innerHTML = "" + p2Score;
        
        this.moves = 0;
        this.DrawBoard("#board");

        if(p1Score == 10 || p2Score == 10){
          alert("Player" + this.playerTurn + " won whole match")
        }
        this.playerTurn = 2;
    }
}

class Cell{

    board : Board;
    mark: string;
    cellDiv: HTMLElement;

    constructor(cellDiv : HTMLElement, board : Board){
        this.cellDiv = cellDiv;
        this.board = board;
        this.mark = "";
    }

    PlaceMark(){
        if(this.mark == ""){
            if(this.board.playerTurn == 1){
                this.mark = "X";
                this.cellDiv.innerHTML = "X";
            }
            else{
                this.mark = "O";
                this.cellDiv.innerHTML = "O";
            }

            this.board.GameOver();
            this.board.CurrentPlayer();
            this.cellDiv.click = null;
        }
    }
}

let game = new Board;
game.DrawBoard("#board");