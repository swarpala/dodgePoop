import {
    cWidth,
    cHeight,
    rightPressed,
    leftPressed,
    isInOfCanvas
} from './dodgePoop.js';

class Player {
    constructor(size = 20, speed = 5){
        this.size = size;
        this.x = (cWidth-size)/2,
        this.y = cHeight-size
        this.speed = speed;
        this.flashDistance = 75;
        this.flashCool = 300;
        this.isFlashEnabled = true
        this.life = 3;
        this.isInvisible = false;
        this.invisibleTime = 500;
        this.damagedColor = {
            red: 255,
            green: 0,
            blue: 0
        }
        this.flashedColor = {
            red: 150,
            green: 150,
            blue: 150
        }
        this.idleColor = {
            red: 50,
            green: 160,
            blue: 250
        }
        this.color = this.idleColor;
    }
    
    flash() {
        if(!this.isFlashEnabled) return;
        if(rightPressed && !leftPressed){
            if(!isInOfCanvas('width', this.x, this.size, this.flashDistance)){
                this.x = cWidth - this.speed - this.size;
            } else {
                this.x += this.flashDistance;
            }
        } else if(leftPressed && !rightPressed)
            if(!isInOfCanvas('width', this.x, this.size, this.flashDistance*(-1))){
                this.x = this.speed;
            } else {
                this.x -= this.flashDistance;
            }
        this.isFlashEnabled = false;
        setTimeout(()=>this.isFlashEnabled = true,this.flashCool);
    }

    damaged(){
        if (this.isInvisible) return;
        this.life--;
        this.isInvisible = true;
        setTimeout(()=>this.isInvisible = false,this.invisibleTime);
    }

    move(){
        if(rightPressed && isInOfCanvas('width', this.x, this.size, this.speed))
            this.x += this.speed;
        if(leftPressed && isInOfCanvas('width', this.x, this.size, this.speed*(-1)))
            this.x -= this.speed;
    }
}

export default Player;