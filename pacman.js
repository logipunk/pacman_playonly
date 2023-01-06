class Pacman {
    constructor(x, y, width, height, speed) {
        this.x = x;//miejesce gdzie jest ulokowany pacman
        this.y = y;//miejesce gdzie jest ulokowany pacman
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = 4;
        this.nextDirection = 2; //DIRECTION_RIGHT
        this.frameCount = 1;
        this.currentFrame = 1;
        setInterval(() => {
            this.changeAnimation();
        }, 100);

        console.log("x: " + this.x + " y: " + this.y );
    }

    


    moveProcess() {
        this.changeDirectionIfPossible();
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            return;
        }
        if(this.checkPassThrough()){
        }

    }

    eat() {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                if (
                    map[i][j] == 2 &&
                    this.getMapX() == j &&
                    this.getMapY() == i
                ) {
                    map[i][j] = 3;
                    score++;
                }
            }
        }
    }

    passThroughJump(x){
        
        //x = 400 y=200
        this.x = x;
        this.y = 200;

    }

    moveBackwards() {
        switch (this.direction) {
            case DIRECTION_RIGHT: // Right
                this.x -= this.speed;
                break;
            case DIRECTION_UP: // Up
                this.y += this.speed;
                break;
            case DIRECTION_LEFT: // Left
                this.x += this.speed;
                break;
            case DIRECTION_BOTTOM: // Bottom
                this.y -= this.speed;
                break;
        }
    }

    moveForwards() {
        switch (this.direction) {
            case DIRECTION_RIGHT: // Right
                this.x += this.speed;
                break;
            case DIRECTION_UP: // Up
                this.y -= this.speed;
                break;
            case DIRECTION_LEFT: // Left
                this.x -= this.speed;
                break;
            case DIRECTION_BOTTOM: // Bottom
                this.y += this.speed;
                break;
        }
    }

    checkPassThrough(){
        let passthrough = false;

        //-2 i 21 pacman wychodzi poza plansze
        if(parseInt(this.x/ oneBlockSize) <= -2) {
            //console.log("PassThrough hit");
            passthrough= true;
            this.passThroughJump(400);

        }else if(parseInt(this.x/ oneBlockSize) == 21)
        {
            passthrough= true;
            this.passThroughJump(0);

        }
        return passthrough;
    }

    checkCollisions() {
        let isCollided = false;
        if (
            map[parseInt(this.y / oneBlockSize)][
                parseInt(this.x / oneBlockSize)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][
                parseInt(this.x / oneBlockSize)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize)][
                parseInt(this.x / oneBlockSize + 0.9999)
            ] == 1 ||
            map[parseInt(this.y / oneBlockSize + 0.9999)][
                parseInt(this.x / oneBlockSize + 0.9999)
            ] == 1
        ) {
            isCollided = true;

        }
        // console.log("Checking collision x: "+ parseInt(this.x/ oneBlockSize) + 
        //             " y:  " + parseInt(this.y/ oneBlockSize)+
        //             " map: "+ map[parseInt(this.y / oneBlockSize)][
        //                 parseInt(this.x / oneBlockSize)
        //             ]+
        //             " collision: "+ isCollided + " this.x: "+this.x );
        return isCollided;
    }

    checkGhostCollision(ghosts) {
        for (let i = 0; i < ghosts.length; i++) {
            let ghost = ghosts[i];
            if (
                ghost.getMapX() == this.getMapX() &&
                ghost.getMapY() == this.getMapY()
            ) {
                return true;
            }
        }
        return false;

    }

    changeDirectionIfPossible() {
        if (this.direction == this.nextDirection) return;
        let tempDirection = this.direction;
        this.direction = this.nextDirection;
        this.moveForwards();
        if (this.checkCollisions()) {
            this.moveBackwards();
            this.direction = tempDirection;
        } else {
            this.moveBackwards();
        }

    }

    getMapX() {
        let mapX = parseInt(this.x / oneBlockSize);
        return mapX;
    }

    getMapY() {
        let mapY = parseInt(this.y / oneBlockSize);
        return mapY;
    }

    getMapXRightSide() {
        let mapX = parseInt((this.x * 0.99 + oneBlockSize) / oneBlockSize);
        return mapX;

    }

    getMapYRightSide() {
        let mapY = parseInt((this.y * 0.99 + oneBlockSize) / oneBlockSize);
        return mapY;
    }

    changeAnimation() {
        this.currentFrame =
            this.currentFrame == this.frameCount ? 1 : this.currentFrame + 1;
    }

    draw() {
        ctx.save();
        ctx.translate(
            this.x + oneBlockSize / 2,
            this.y + oneBlockSize / 2
        );
        ctx.rotate((this.direction * 90 * Math.PI) / 180);
        ctx.translate(
            -this.x - oneBlockSize / 2,
            -this.y - oneBlockSize / 2
        );
        ctx.drawImage(
            myGame.pacmanFrames,
            0,//(this.currentFrame - 1) * oneBlockSize,
            0,
            600,//oneBlockSize,
            900,//oneBlockSize,
            this.x,
            this.y,
            this.width,
            this.height
        );
        ctx.restore();
        
    }

    

}