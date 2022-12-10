document.addEventListener('DOMContentLoaded',ev=>{

    const canvas = document.getElementById('myCanvas');
    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext('2d');
    //------------------------------------
    class Player {
        constructor(side = 15, speed = 3){
            this.side = side;
            this.x = canvas.width/2,
            this.y = canvas.height-side
            this.speed = speed;
            this.color = '#000000';
            this.flashDistance = 50;
            this.flashCool = 300;
            this.isFlashEnabled = true
            this.life = 3;
        }
        
        flash() {
            if(!this.isFlashEnabled) return;
            if(rightPressed && !leftPressed){
                if(!isInOfCanvas('width', this.x, this.side, this.flashDistance)){
                    this.x = canvas.width - this.speed - this.side;
                } else {
                    this.x += this.flashDistance;
                }
            } else if(leftPressed && !rightPressed)
                if(!isInOfCanvas('width', this.x, this.side, this.flashDistance*(-1))){
                    this.x = this.speed;
                } else {
                    this.x -= this.flashDistance;
                }
            this.isFlashEnabled = false;
            setTimeout(()=>this.isFlashEnabled = true,this.flashCool);
        }
    }

    class Poop {
        constructor(side = 15, acc = 0.1){
            this.side = side;
            this.x = parseInt(Math.random()*(canvas.width - side));
            this.y = 0;
            this.speed = 1;
            this.acc = acc;
            this.color = '#64320A';
        }
    }

    let player = new Player();
    let score = 0, renderScore = 0;
    let poopArray = [new Poop],idxOfFallenPoop = [];
    let rightPressed = false, leftPressed = false;

    function draw(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.closePath();
        drawPlayer();
        drawPoop();
        addScore();
        drawScore();
        requestAnimationFrame(draw);
    }

    function drawPlayer(){
        ctx.beginPath();
        ctx.rect(player.x, player.y, player.side, player.side);
        ctx.fillStyle = player.color;
        ctx.fill();

        if(rightPressed && isInOfCanvas('width', player.x, player.side, player.speed))
            player.x += player.speed;
        if(leftPressed && isInOfCanvas('width', player.x, player.side, player.speed*(-1)))
            player.x -= player.speed;
    }

    function drawScore(){
        ctx.font = '16px Consolas';
        ctx.fillStyle = '#000000';
        ctx.fillText('점수:'+renderScore, 8, 20)
    }

    function addScore(){
        score++;
        renderScore = parseInt(score/5);
    }

    function drawPoop(){
        let poop;
        for(let i=0; i<poopArray.length; i++){
            poop = poopArray[i];
            ctx.beginPath();
            ctx.rect(poop.x, poop.y, poop.side, poop.side);
            ctx.fillStyle = poop.color;
            ctx.fill();
            poop.speed += poop.acc;
            poop.y += poop.speed;
            if(!isInOfCanvas('height', poop.y, poop.side, poop.speed, poop.side)){
                poopArray.splice(idxOfFallenPoop[i],1);
            }
        }
        addPoop();
    }

    function addPoop(){
        while (poopArray.length < score/100){
            poopArray.push(new Poop);
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
        if(direction === 'width') threshold = canvas.width;
        else if(direction === 'height') threshold = canvas.height
        else throw "argument direction must be 'width' or 'height'.";
        return (
            pos + operand < threshold-objSize+offset &&
            pos + operand > 0-offset
        )
    }

    draw();
});