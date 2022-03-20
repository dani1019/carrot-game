'use strict';
import PopUp from './popup.js';

const field = document.querySelector('.game__field');
const fieldObject = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__time');
const gameScore = document.querySelector('.game__score');

const imgSize = 80;
const CARROT_COUNT = 10;
const BUG_COUNT = 10;
const GAME_DURATION_SEC = 10;

let timer = undefined;
let score = 0;
let started = false;

const gameFinishBanner = new PopUp();
gameFinishBanner.setClickListener(()=>{
    startGame();
});

function initGame(){
    addItem('carrot',CARROT_COUNT,'img/carrot.png');
    addItem('bug',BUG_COUNT,'img/bug.png');
}

function addItem(classPath,count,imgPath){
   const x1 = 0;
   const y1 = 0;
   const x2 = fieldObject.width - imgSize;
   const y2 = fieldObject.height - imgSize;
   
   for(let i=0; i< count; i++){
    const img = document.createElement('img');
    img.setAttribute('class', classPath);
    img.setAttribute('src', imgPath);
    img.style.position = 'absolute';
    const x = randomSpot(x1, x2);
    const y = randomSpot(y1, y2);
    img.style.left=`${x}px`;
    img.style.top=`${y}px`;
    field.appendChild(img);
   }
};

//gameFieldを押すとonfieldClickを呼び出す
field.addEventListener('click',onfieldClick);

function randomSpot(min, max){
    return Math.random()*(max-min) + min;
};

gameBtn.addEventListener('click', () => {
    if(started){
        stopGame();
    }else{
        startGame();
    }
});

function startGame(){
    started = true;
    field.innerHTML= '';
    initGame();
    showStopButton();
    showTimerAndScore();
    startGameTimer();
}

function stopGame(){
    started = false;
    stopGameTimer();
    hiddenGameButton();
    gameFinishBanner.showWithText('REPLAY?');
};

function finishGame(win){
    started = false;
    hiddenGameButton();
    gameFinishBanner.showWithText(win ? 'YOU WIN' : 'YOU LOST');
}

function onfieldClick(event){
    if(!started){
        return;
    }
    const target = event.target;
    if(target.matches('.carrot')){
        target.remove();
        score++;
        updataScoreBoard();
        if(CARROT_COUNT === score){
            finishGame(true);
        }
    }else if(target.matches('.bug')){
        stopGameTimer();
        finishGame(false);  
    }
}

function updataScoreBoard(){
    gameScore.innerText = CARROT_COUNT - score;
}

function showStopButton(){
    const icon = document.querySelector('.fas');
    icon.classList.remove('fa-caret-right');
    icon.classList.add('fa-stop');
    const stopBtn = document.querySelector('.fa-stop');
    stopBtn.style.fontSize = '50px';
    gameBtn.style.visibility = 'visible';
}

function hiddenGameButton(){
    gameBtn.style.visibility = 'hidden';
    gameFinishBanner.hide();
}

function showTimerAndScore(){
    gameTimer.style.visibility = 'visible';
    gameScore.style.visibility = 'visible';
}

function startGameTimer(){
    let remainTime = GAME_DURATION_SEC;
    updateTimeText(remainTime);
    timer = setInterval(()=>{
        if(remainTime <= 0){
            clearInterval(timer);
            finishGame(CARROT_COUNT==score);
            return;
        }
        updateTimeText(--remainTime);
    },1000);
};

function stopGameTimer(){
    clearInterval(timer);
}

function updateTimeText(time){
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    gameTimer.innerHTML = `${minutes}:${seconds}`;
};

