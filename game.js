// const canvas = document.getElementById("canvas");
// const canvasContext = canvas.getContext("2d");
// const pacmanFrames = document.getElementById("animations");
// const ghostFrames = document.getElementById("ghosts");


// Game variables
let fps = 30;
let pacman;
let oneBlockSize = 20;
let score = 0;
let ghosts = [];
let wallSpaceWidth = oneBlockSize / 1.6;
let wallOffset = (oneBlockSize - wallSpaceWidth) / 2;
let wallInnerColor = "black";
let foodCounter = 0;
const DIRECTION_RIGHT = 4;
const DIRECTION_UP = 3;
const DIRECTION_LEFT = 2;
const DIRECTION_BOTTOM = 1;
let lives = 3;
let ghostCount = 2;//zmien na 4 
let ghostImageLocations = [
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
];
var myGame;
var ctx;




function startGame(){
    console.log("Start Game");
    //document.getElementById("mystartbutton").style.display = "none";
    myGame = new gameConsole();
    myGame.start();


}


function gameConsole(){

    console.log("Game Console started");
    this.canvas = document.getElementById("canvas");
    this.canvasContext = canvas.getContext("2d");
    this.pacmanFrames = document.getElementById("animations");
    this.ghostFrames = document.getElementById("ghosts");
    ctx = this.canvasContext;
    createNewPacman();
    createGhosts();

    this.start = function(){
        //set interval odpowiada za rysowanie planszy i calej gry
        this.gameInterval = setInterval(gameLoop, 1000 / fps,); 
        //gameLoop();
    }
    this.stop = function(){
        clearInterval(this.gameInterval);
    }
    this.clear = function(){
        this.canvasContext.clearRect(0,0,canvas.width,canvas.height);

    }
}


let createRect = (x, y, width, height, color) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, width, height);
};

// we now create the map of the walls,
// if 1 wall, if 0 not wall
// 21 columns // 23 rows
let map = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let randomTargetsForGhosts = [
    { x: 1 * oneBlockSize, y: 1 * oneBlockSize },
    { x: 1 * oneBlockSize, y: (map.length - 2) * oneBlockSize },
    { x: (map[0].length - 2) * oneBlockSize, y: oneBlockSize },
    {
        x: (map[0].length - 2) * oneBlockSize,
        y: (map.length - 2) * oneBlockSize,
    },
];

let gameLoop = () => {
    update();
    draw();
    

};

let restartPacmanAndGhosts = () => {
    createNewPacman();
    createGhosts();
};

let restartGame = () => {
    score=0;
    lives=3;
    myGame.canvas.removeEventListener('mousemove',handleMouseMove);
    myGame.canvas.removeEventListener('click',handleMouseClick);
    myGame.canvas.removeEventListener('mousemove',handleWonMouseMove);
    myGame.canvas.removeEventListener('click',handleWonMouseClick);
    myGame.stop();
    myGame.clear();
    myGame={};
    resetFoods();
    startGame();
};

let onGhostCollision = () => {
    lives--;
    restartPacmanAndGhosts();
    
};

let gameOver = () => {
    drawGameOver();
    myGame.stop();
    
};

let GameWin = () => {
    drawGameWin();
    myGame.stop();
    
};


//adding fonts
var f = new FontFace('Emulogic', 'url(assets/Emulogic-zrEw.ttf)');

f.load().then(function(font) {

  // Ready to use the font in a canvas context
  //console.log('font ready');

  // Add font on the html page
  document.fonts.add(font);

});

//used for links at game over screen
function handleMouseMove(e) {
    // code for the event listener goes here
    //Replay link
    if(e.x > 20 && e.x < 120 && e.y > 100 && e.y < 125){
        myGame.canvas.style.cursor = 'pointer';
        
    } 
    //claim link 
    else if(e.x > 150 && e.x < 220 && e.y > 100 && e.y < 125){          
        myGame.canvas.style.cursor = 'pointer';           
    }
    //SBF FUND link
    else if(e.x > 250 && e.x < 380 && e.y > 100 && e.y < 125){
        myGame.canvas.style.cursor = 'pointer'; 
    }
    else {
        myGame.canvas.style.cursor = 'default';
        

    }
}

function handleMouseClick(e) {
    if(e.x > 20 && e.x < 120 && e.y > 100 && e.y < 125){  
        myGame.canvas.style.cursor = 'default';
        restartGame();
    }

}

//used for links at game won screen
function handleWonMouseMove(e) {
    // code for the event listener goes here
    //Play Again link
    if(e.x > 40 && e.x < 200 && e.y > 200 && e.y < 225){
        myGame.canvas.style.cursor = 'pointer';
        
    } 
    //claim link 
    else if(e.x > 210 && e.x < 380 && e.y > 200 && e.y < 225){          
        myGame.canvas.style.cursor = 'pointer';           
    }
    
    else {
        myGame.canvas.style.cursor = 'default';
    }
}

function handleWonMouseClick(e) {
    //clicked play again
    if(e.x > 40 && e.x < 200 && e.y > 200 && e.y < 225){  
        myGame.canvas.style.cursor = 'default';
        restartGame();
    }

}

let drawGameOver = () => {
    //draw sbf
    ctx.drawImage(
        myGame.ghostFrames,
        0,
        0,
    );

    ctx.font = "25px Emulogic";
    ctx.fillStyle = "#a5b9cc";
    ctx.fillText("!!!GAME OVER!!! ",40,40);
    ctx.font = "15px Emulogic";

    //replay link
    ctx.fillText("Replay",20,120);
    ctx.fillRect(21, 120, 100, 2);

    //claim link
    ctx.fillText("Claim",150,120);
    ctx.fillRect(151, 120, 80, 2);

    //SBF Claim link
    ctx.fillText("SBF FUND",260,120);
    ctx.fillRect(261, 120, 120, 2);

    myGame.canvas.addEventListener('mousemove',handleMouseMove); 

    myGame.canvas.addEventListener("click",handleMouseClick); 
    
};



let drawGameWin = () => {
    ctx.drawImage(
        myGame.pacmanFrames,
        0,
        0,
        canvas.width-90,
        canvas.height-50
    );
    ctx.font = "25px Emulogic";
    ctx.fillStyle = "#e03b1b";
    ctx.fillText("!!!YOU WON!!! ",40,80);
    
    //to do
    //show cult head gif
    //create link to "CLAIM" cult tokens
    //create link to replay the game (in future Level 2).
    //replay link
    ctx.font = "15px Emulogic";
    ctx.fillStyle = "#0f0f0f";
    ctx.fillText("Play Again",40,220);
    ctx.fillRect(36, 220, 160, 2);

    //claim link
    ctx.fillText("Claim Tokens",210,220);
    ctx.fillRect(211, 220, 185, 2);

    myGame.canvas.addEventListener('mousemove',handleWonMouseMove); 
    myGame.canvas.addEventListener("click",handleWonMouseClick); 
};

let drawRemainingLives = () => {
    ctx.font = "20px Emulogic";
    ctx.fillStyle = "white";
    ctx.fillText("Lives: ", 220, oneBlockSize * (map.length + 1));

    for (let i = 0; i < lives; i++) {
        ctx.drawImage(
            myGame.pacmanFrames,
            0,//2 * oneBlockSize,
            0,
            600,//oneBlockSize,
            900,//oneBlockSize,
            350 + i * oneBlockSize,
            oneBlockSize * map.length + 2,
            oneBlockSize,
            oneBlockSize
        );
    }
};


let update = () => {
    pacman.moveProcess();
    pacman.eat();
    updateGhosts();
    if (pacman.checkGhostCollision(ghosts)) {
        onGhostCollision();
    }
};

let draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    createRect(0, 0, canvas.width, canvas.height, "black");
    drawWalls();
    drawFoods();
    drawGhosts();
    pacman.draw();
    drawScore();
    drawRemainingLives();
    if (lives == 0) {
        gameOver();
    }
    if(score >= foodCounter){
        GameWin();

    }
   
};

let resetFoods = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 3) {
                map[i][j] = 2;
            }
        }
    }
};

let drawFoods = () => {
    for (let i = 0; i < map.length; i++) {
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 2) {
                createRect(
                    j * oneBlockSize + oneBlockSize / 3,
                    i * oneBlockSize + oneBlockSize / 3,
                    oneBlockSize / 3,
                    oneBlockSize / 3,
                    "#00A300"
                );
                
            }
        }
    }
};

//used to count all the foods , to see if userhas WON
for (let i = 0; i < map.length; i++) {
    for (let j = 0; j < map[0].length; j++) {
        if (map[i][j] == 2) {
            foodCounter++;
        }
    }
}


let drawScore = () => {
    ctx.font = "20px Emulogic";
    ctx.fillStyle = "white";
    ctx.fillText(
        "Score: " + score,
        0,
        oneBlockSize * (map.length + 1)
    );
};

let drawWalls = () => {
    
    for (let i = 0; i < map.length; i++) {
        
        for (let j = 0; j < map[0].length; j++) {
            if (map[i][j] == 1) {
                createRect(
                    j * oneBlockSize,
                    i * oneBlockSize,
                    oneBlockSize,
                    oneBlockSize,
                    "#342DCA"
                );
                if (j > 0 && map[i][j - 1] == 1) {
                    createRect(
                        j * oneBlockSize,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if (j < map[0].length - 1 && map[i][j + 1] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth + wallOffset,
                        wallSpaceWidth,
                        wallInnerColor
                    );
                }

                if (i < map.length - 1 && map[i + 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize + wallOffset,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }

                if (i > 0 && map[i - 1][j] == 1) {
                    createRect(
                        j * oneBlockSize + wallOffset,
                        i * oneBlockSize,
                        wallSpaceWidth,
                        wallSpaceWidth + wallOffset,
                        wallInnerColor
                    );
                }
            }
        }
    }
};



let createNewPacman = () => {
    pacman = new Pacman(
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize,
        oneBlockSize / 5
    );
};

let createGhosts = () => {
    ghosts = [];
    for (let i = 0; i < ghostCount * 2; i++) {
        let newGhost = new Ghost(
            9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            10 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize,
            oneBlockSize,
            oneBlockSize,
            pacman.speed / 2,
            ghostImageLocations[i % 4].x,
            ghostImageLocations[i % 4].y,
            400,//124,
            400,//116,
            6 + i
        );
        ghosts.push(newGhost);
    //console.log("kreauje duszka...");
    //console.log("x: "+9 * oneBlockSize + (i % 2 == 0 ? 0 : 1) * oneBlockSize );
    
    }
}



window.addEventListener("keydown", (event) => {
    let k = event.keyCode;
    setTimeout(() => {
        if (k == 37 || k == 65) {
            // left arrow or a
            pacman.nextDirection = DIRECTION_LEFT;
        } else if (k == 38 || k == 87) {
            // up arrow or w
            pacman.nextDirection = DIRECTION_UP;
        } else if (k == 39 || k == 68) {
            // right arrow or d
            pacman.nextDirection = DIRECTION_RIGHT;
        } else if (k == 40 || k == 83) {
            // bottom arrow or s
            pacman.nextDirection = DIRECTION_BOTTOM;
        }
    }, 1);
});