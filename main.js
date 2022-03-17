const field = document.querySelector('.game__field');
const fieldObject = field.getBoundingClientRect();
const gameBtn = document.querySelector('.game__button');
const gameTimer = document.querySelector('.game__time');
const gameScore = document.querySelector('.game__score');
const popUp = document.queryCommandValue('.pop-up');
const popUpRefresh = document.querySelector('.pop-up__refresh');
const popUpText = document.querySelector('.pop-up__message');
const imgSize = 80;
const CARROT_COUNT = 10;
const BUG_COUNT = 10;
const GAME_DURATION_SEC = 10;
let GAME_SCORE = 10;
let timer = undefined;
let score = 0;

let started = false;
//.game__field'에 img를 추가한다.
//game__field의 범위에서..

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

//게임 시작 전 당근, 벌레를 클릭하면, 눌리지 않게 해야함.
field.addEventListener('click',(event) => onfieldClick(event));

function randomSpot(min, max){
    return Math.random()*(max-min) + min;
};

//게임시작 버튼 누르고, startGame()가 호출이 되고전에도, onfieldClick는 클릭가능.
// 
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
    showStopBtn();
    showTimerAndScore();
    startGameTimer();
}

function stopGame(){
    started = false;
    stopGameTimer();
    hiddenGameButton();
    showPopUpWithText('REPLAY?');
};

function finishGame(win){
    started = false;
    stopBtnHidden();
    showPopUpWithText(win ? 'YOU WIN' : 'YOU LOST');
}


//게임 시작 전 당근, 벌레를 클릭하면, 눌리지 않게 해야함.
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

popUpRefresh.addEventListener('click',()=>{
    startGame();
    hidePopUp();
});

function updataScoreBoard(){
    gameScore.innerText = CARROT_COUNT - score;
}

function showStopBtn(){
    const icon = document.querySelector('.fas');
    icon.classList.remove('fa-caret-right');
    icon.classList.add('fa-stop');
    const stopBtn = document.querySelector('.fa-stop');
    stopBtn.style.fontSize = '50px';
}

function hiddenGameButton{
    gameBtn.style.visibility = 'hidden';
}

function showTimerAndScore(){
    gameTimer.style.visibility = 'visible';
    gameScore.style.visibility = 'visible';
}

function startGameTimer(){
    let remainTime = GAME_DURATION_SEC;
    let score = CARROT_COUNT;
    timer = setInterval(()=>{
        if(remainTime == 0){
            clearInterval(timer);
            finishGame(CARROT_COUNT==score);
            return;
        }
        updateTime(--remainTime);
    },1000);
};

function stopGameTimer(){
    clearInterval(timer);
}

function showPopUpWithText(){
    gameBtn.style.visibility = 'hidden';
}

function popUpShow(text){
    popUpRefresh.style.visibility = 'visible';
    popUpText.innerText = text;
}

function  hidePopUp(){

}
function updateTime(time){
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    gameTimer.innerHTML = `${minutes}:${seconds}`;
};