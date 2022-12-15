const canvas = document.getElementById('myCanvas');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');
canvas.offCanvas = document.createElement('canvas');
canvas.offCtx = canvas.offCanvas.getContext('2d');
// let poopSize = 15, poopColor = '#64320A';

const poopImg = new Image();

const cWidth = canvas.width, cHeight = canvas.height;

ctx.textAlign = 'center';//center-align
//------------------------------------
class Player {
    constructor(size = 25, speed = 5){
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

class Poop {
    constructor(){
        this.x = parseInt(Math.random()*(cWidth - poopImg.width));
        this.y = 0;
        this.speed = 1.5;
        this.acc = parseInt(Math.random()*5+10)/100;
    }

    iscollided(player){
        if(
            ((player.x >= this.x && player.x <= this.x+poopImg.width) ||
            (player.x+player.size >= this.x && player.x+player.size <= this.x+poopImg.width)) &&
            (player.y <= this.y+poopImg.width)
        ){
            return true;
        }
        return false;
    }
}

function getRank(score) {
    switch(true){
        case (score<250):
            return ['불합격','95정비의 똥파리한테 잡히는 수준.'];
        case (score<500):
            return ['3급','전투체단 더 하고 오세요.'];
        case (score<750):
            return ['2급','당신, 좀 치는군요?'];
        case (score<1000):
            return ['1급','용사중에 당신만한 사람은 없을거에요.'];
        default:
            return ['특급','『전문하사』에 도전할만한 수준。'];
    }
};

let player = new Player();
let score = 0, renderScore = 0;
let poopArray = [new Poop()],idxOfFallenPoop = [];
let rightPressed = false, leftPressed = false;
let animateId;

function draw(){
    ctx.clearRect(0, 0, cWidth, cHeight);
    ctx.closePath();
    drawLife();
    addScore();
    drawScore();
    drawPlayer();
    drawPoop();
    if(player.isInvisible){
        player.color = `rgb(${player.damagedColor.red}, ${player.damagedColor.green}, ${player.damagedColor.blue})`
    } else if(!player.isFlashEnabled){
        player.color = `rgb(${player.flashedColor.red}, ${player.flashedColor.green}, ${player.flashedColor.blue}`
    } else {
        player.color = `rgb(${player.idleColor.red}, ${player.idleColor.green}, ${player.idleColor.blue})`
    }
    if(!player.life) {
        ctx.clearRect(0, 0, cWidth, cHeight);
        ctx.closePath();
        drawGameOver();
    } else 
        requestAnimationFrame(draw);
}

function drawPlayer(){
    ctx.beginPath();
    ctx.rect(player.x, player.y, player.size, player.size);
    ctx.fillStyle = player.color;
    ctx.fill();
    player.move();
}

function drawScore(){
    ctx.font = '40px Consolas';
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillText(`${renderScore}`, cWidth/2, cHeight/3)
}

function drawLife(){
    ctx.font = '30px Consolas';
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    let txt = '';
    for(let i=0; i<player.life; i++) txt += '●';
    ctx.fillText(txt, cWidth/2, (cHeight/3)+30);
}

function addScore(){
    score++;
    renderScore = parseInt(score/5);
}

function drawPoop(){
    let poop;
    for(let i=0; i<poopArray.length; i++){
        poop = poopArray[i];
        ctx.drawImage(canvas.offCanvas, poop.x, poop.y);
        poop.speed += poop.acc;
        poop.y += poop.speed;
        if(!isInOfCanvas('height', poop.y, poopImg.height, poop.speed, poopImg.height)){
            poopArray.splice(i,1);
        }
        if(poop.iscollided(player)){
            poopArray.splice(i,1);
            player.damaged();
        }
    }
    addPoop();
}

function drawGameOver(){
    let playerRank = getRank(renderScore);
    let fontSize = 16, offset = 10;
    ctx.font = fontSize+'px Consolas';
    ctx.fillStyle = 'rgb(0,0,0)';
    ctx.fillText(
        `당신의 점수는 ${renderScore}점 입니다.`
        ,cWidth/2
        ,cHeight/2-(fontSize+offset)
    )
    ctx.fillText(
        '등급: '+playerRank[0]
        ,cWidth/2
        ,cHeight/2
    )
    ctx.fillText(
        playerRank[1]
        ,cWidth/2
        ,cHeight/2+(fontSize+offset)
    )
}

function addPoop(){
    while (poopArray.length < score/100){
        poopArray.push(new Poop());
    }
}

document.addEventListener('keydown',ev=>{
    if(ev.code === 'ArrowRight') rightPressed = true; 
    else if(ev.code === 'ArrowLeft') leftPressed = true;
    else if(ev.code === 'KeyD') player.flash();
})

document.addEventListener('keyup',ev=>{
    if(ev.code === 'ArrowRight') rightPressed = false;
    else if(ev.code === 'ArrowLeft') leftPressed = false;
})

function isInOfCanvas(direction, pos, objSize, operand, offset = 0) {
    // debugger;
    let threshold;
    if(direction === 'width') threshold = cWidth;
    else if(direction === 'height') threshold = cHeight
    else throw "argument direction must be 'width' or 'height'.";
    return (
        pos + operand < threshold-objSize+offset &&
        pos + operand > 0-offset
    )
}

poopImg.src = 'resource/poop.png';

poopImg.addEventListener('load', () => {
    canvas.offCanvas.width = 30;
    canvas.offCanvas.height = 15;
    canvas.offCtx.drawImage(poopImg, 0, 0);
    draw();
});
