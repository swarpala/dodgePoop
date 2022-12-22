import {
    cWidth,
} from "./dodgePoop.js";

class Poop {
    constructor(objWidth){
        this.x = parseInt(Math.random()*(cWidth - objWidth));
        this.y = 0;
        this.speed = 1.5;
        this.acc = parseInt(Math.random()*5 + 10)/100;
    }

    iscollided(player){
        if(
            ((player.x >= this.x && player.x <= this.x + objWidth) ||
            (player.x + player.size >= this.x && player.x + player.size <= this.x + objWidth)) &&
            (player.y <= this.y + objWidth)
        ){
            return true;
        }
        return false;
    }
}

export default Poop;