import Player from "./player.js";
import Poop from "./fallingObj.js";

const canvas = document.getElementById('myCanvas');
/** @type {CanvasRenderingContext2D} */
const ctx = canvas.getContext('2d');
canvas.offCanvas = document.createElement('canvas');
canvas.offCtx = canvas.offCanvas.getContext('2d');

const poopImg = new Image();

const cWidth = canvas.width, cHeight = canvas.height;

ctx.textAlign = 'center';
//------------------------------------
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
let poopArray = [new Poop()];
let rightPressed = false, leftPressed = false;

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
    ctx.fillText(`${renderScore}`, cWidth/2, cHeight/8)
}

function drawLife(){
    ctx.font = '30px Consolas';
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    let txt = '';
    for(let i=0; i<player.life; i++) txt += '●';
    ctx.fillText(txt, cWidth/2, (cHeight/8)+30);
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
    document.addEventListener('keydown',ev=>{
        if(ev.code === 'Enter') window.location.reload();
    })
    ctx.font = fontSize/1.5+'px Consolas';
    ctx.fillText(
        'Enter로 재시작'
        ,cWidth/2
        ,cHeight/2+(fontSize+offset*5)
    )
}

function addPoop(){
    while (poopArray.length < score/100){
        poopArray.push(new Poop(poopImg.width));
    }
}

document.addEventListener('keydown',ev=>{
    if(ev.code === 'ArrowRight') rightPressed = true; 
    else if(ev.code === 'ArrowLeft') leftPressed = true;
    else if(ev.code === 'Space') player.flash();
})

document.addEventListener('keyup',ev=>{
    if(ev.code === 'ArrowRight') rightPressed = false;
    else if(ev.code === 'ArrowLeft') leftPressed = false;
})

function isInOfCanvas(direction, pos, objSize, operand, offset = 0) {
    let threshold;
    if(direction === 'width') threshold = cWidth;
    else if(direction === 'height') threshold = cHeight
    else throw "argument direction must be 'width' or 'height'.";
    return (
        pos + operand < threshold-objSize+offset &&
        pos + operand > 0-offset
    )
}

poopImg.src = './resource/poop.png';

poopImg.addEventListener('load', () => {
    canvas.offCanvas.width = poopImg.width;
    canvas.offCanvas.height = poopImg.height;
    canvas.offCtx.drawImage(poopImg, 0, 0);
    draw();
});

export {cWidth, cHeight, rightPressed, leftPressed, isInOfCanvas};