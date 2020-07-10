import './style.scss';

const canvas: HTMLCanvasElement = document.querySelector("canvas") as HTMLCanvasElement;
const context: CanvasRenderingContext2D = canvas.getContext("2d");
const gameReset: HTMLElement = document.querySelector("#reset");
const pointsDiv: HTMLElement = document.querySelector("#points");

class Game {

  ball: Circle;
  holes: Circle[];
  target: Circle;
  points: number;

  readonly ballRadius: number = 10;
  readonly holeRadius: number = 20;
  readonly targetRadius: number = 30;
  readonly holesAmount: number = 10;

  constructor(){
      let controller = new Controller;
      this.Start(this.holesAmount, controller);
      gameReset.addEventListener("click", () => {controller.Stop(), this.Start(this.holesAmount, controller)});
  }

  Start(holesAmount: number, controller: Controller){
      
      this.CreateCircles(holesAmount);
      this.points = 0;
      pointsDiv.innerHTML=""+this.points;

      setInterval(() =>{
          context.clearRect(0, 0, canvas.width, canvas.height);

          this.Collider(this.ball, this.holes, this.target, controller);

          this.Render(this.ball.x, this.ball.y, this.ballRadius, "#21bf34");

          this.holes.forEach(element => {
              this.Render(element.x, element.y, this.holeRadius, "#ed1536");
          });
          this.Render(this.target.x, this.target.y, this.targetRadius, "#15e6ed");
          
      },16);
  }

  Collider(ball: Circle, holes: Circle[], target: Circle, controller: Controller){
      
      if (Math.sqrt(Math.pow(ball.x - target.x, 2) + Math.pow(ball.y - target.y, 2)) < ball.radius + target.radius + 20){

        this.target = new Circle (this.holes[this.points].x, this.holes[this.points].y, this.holeRadius)
        let h = this.holes[this.points] = new Circle (Math.random()*canvas.width, Math.random()*canvas.height, this.holeRadius);
        holes.push(h);
        this.points++;
        pointsDiv.innerHTML=""+this.points;
      }else{
        this.holes.forEach(element => {
           if(Math.sqrt(Math.pow(ball.x - element.x, 2) + Math.pow(ball.y - element.y, 2)) < ball.radius + element.radius){
              controller.Stop();
              this.Start(this.holesAmount, controller);
            }
        });
      }
              
      if(ball.x + controller.velocityX < 0 + ball.radius ||
         ball.x + controller.velocityX > canvas.width - ball.radius){
           controller.velocityX = 0;
      }else if(
         ball.y + controller.velocityY < 0  + ball.radius ||
         ball.y + controller.velocityY > canvas.height - ball.radius){

           controller.velocityY = 0;

      }else{
        controller.Move(ball, controller.velocityX, controller.velocityY);
      }
  }


  Render(x:number, y: number, radius: number,color: string){
      context.beginPath();
      context.arc(x, y, radius, 0, 2* Math.PI);
      context.fillStyle = "" + color;
      context.fill();
  }


  CreateCircles(holesAmount: number){
      this.holes = new Array;
      this.ball = new Circle(canvas.width/2, canvas.height/2, this.ballRadius);
      this.target = new Circle(Math.random()*canvas.width, Math.random()*canvas.height, this.ballRadius);

      for (let i = 0; i<holesAmount; i++){
          let x = Math.random()*canvas.width;
          let y = Math.random()*canvas.height;
          this.holes.push(new Circle(x, y, this.holeRadius));
      }
  }
}



class Circle {
  x: number;
  y: number;
  radius: number;

  constructor(x:number, y: number, radius: number){
      this.x = x;
      this.y = y;
      this.radius = radius;
  }
}

class Controller{

  readonly speed: number = 0.001;

  velocityX = 0;
  velocityY = 0;
  
  constructor(){
      window.addEventListener('deviceorientation',(event) => this.AddVellocity(event, this.speed));
  }

  AddVellocity(event: DeviceOrientationEvent, speed: number){
      this.velocityX += event.alpha*speed;
      this.velocityY += (event.beta-90)*speed;
  }

  Move(ball:Circle, velocityX: number, velocityY: number){
      ball.x += velocityX;
      ball.y += velocityY;
  }

  Stop(){
      this.velocityX = 0;
      this.velocityY = 0;
  }
}

let g = new Game;