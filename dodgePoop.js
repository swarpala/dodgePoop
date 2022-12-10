document.addEventListener('DOMContentLoaded',ev=>{

    const canvas = document.getElementById('myCanvas');
    /** @type {CanvasRenderingContext2D} */
    const ctx = canvas.getContext('2d');
    //------------------------------------
    class Player {
        constructor(size = 25, speed = 5){
            this.size = size;
            this.x = canvas.width/2,
            this.y = canvas.height-size
            this.speed = speed;
            this.color = 'rgb(50, 160, 250)';
            this.flashDistance = 75;
            this.flashCool = 300;
            this.isFlashEnabled = true
            this.lookingDir = null;
            this.life = 3;
            this.invi = false;
            this.inviTime = 500;
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
            this.colorFade = 1;
        }
        
        flash() {
            if(!this.isFlashEnabled) return;
            if(rightPressed && !leftPressed){
                if(!isInOfCanvas('width', this.x, this.size, this.flashDistance)){
                    this.x = canvas.width - this.speed - this.size;
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
            if (this.invi) return;
            this.life--;
            if(!this.life){
                alert(`Your score is ${renderScore}. Try again!`)
                window.location.reload();
            }
            this.colorFade = 0;
            this.invi = true;
            setTimeout(()=>this.invi = false,this.inviTime);
        }
    }

    class Poop {
        constructor(size = 15, acc = 0.1){
            this.size = size;
            this.x = parseInt(Math.random()*(canvas.width - size));
            this.y = 0;
            this.speed = 1;
            this.acc = acc;
            this.color = '#64320A';
        }

        iscollided(player){
            if(
                ((player.x >= this.x && player.x <= this.x+this.size) ||
                (player.x+player.size >= this.x && player.x+player.size <= this.x+this.size)) &&
                (player.y <= this.y+this.size)
            ){
                return true;
            }
            return false;
        }
    }

    let player = new Player();
    let score = 0, renderScore = 0;
    let poopArray = [new Poop],idxOfFallenPoop = [];
    let rightPressed = false, leftPressed = false;
    let animateId;

    function draw(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.closePath();
        drawPlayer();
        drawPoop();
        addScore();
        drawScore();
        drawLife();
        if(player.invi){
            player.color = `rgb(${player.damagedColor.red}, ${player.damagedColor.green}, ${player.damagedColor.blue})`
        } else if(!player.isFlashEnabled){
            player.color = `rgb(${player.flashedColor.red}, ${player.flashedColor.green}, ${player.flashedColor.blue}`
        } else {
            player.color = `rgb(${player.idleColor.red}, ${player.idleColor.green}, ${player.idleColor.blue})`
        }
        animateId = requestAnimationFrame(draw);
    }

    function drawPlayer(){
        ctx.beginPath();
        ctx.rect(player.x, player.y, player.size, player.size);
        ctx.fillStyle = player.color;
        ctx.fill();

        if(rightPressed && isInOfCanvas('width', player.x, player.size, player.speed))
            player.x += player.speed;
            player.lookingDir = 'right';
        if(leftPressed && isInOfCanvas('width', player.x, player.size, player.speed*(-1)))
            player.x -= player.speed;
            player.lookingDir = 'left';
    }

    function drawScore(){
        ctx.font = '16px Consolas';
        ctx.fillStyle = '#000000';
        ctx.fillText(`score:${renderScore}`, 8, 20)
    }

    function drawLife(){
        ctx.font = '16px Consolas';
        ctx.fillStyle = '#000000';
        ctx.fillText(`life:${player.life}`, 8, 40)
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
            ctx.rect(poop.x, poop.y, poop.size, poop.size);
            ctx.fillStyle = poop.color;
            ctx.fill();
            poop.speed += poop.acc;
            poop.y += poop.speed;
            if(!isInOfCanvas('height', poop.y, poop.size, poop.speed, poop.size)){
                poopArray.splice(i,1);
            }
            if(poop.iscollided(player)){
                poopArray.splice(i,1);
                player.damaged();
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