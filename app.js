let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let count = 0;
const line = document.querySelector(".line");

const clickSound = new Audio("sound/click.wav");
const winSound = new Audio("sound/win.mp3");
const resetSound = new Audio("sound/reset.wav");

let turnO = true; //playerO, playerX

const winPatterns = [
    [0,1,2,0,-20.5,0],
    [0,3,6,-19.5,0,90],
    [0,4,8,0,0,45],
    [1,4,7,0,0,90],
    [2,5,8,19.5,0,90],
    [2,4,6,0,0,135],
    [3,4,5,0,0,0],
    [6,7,8,0,20.5,0],
];

const resetGame = () => {
    resetSound.currentTime = 0;
    resetSound.play();
    turnO = true;
    count = 0;
    line.style.width = "0";
    enableBoxes();
    msgContainer.classList.add("hide");
    line.classList.add("hide");
};

boxes.forEach((box) => {
    box.addEventListener("click", async () => {
        clickSound.volume = 0.8;
        clickSound.currentTime = 0;
        clickSound.play();
        if(turnO) {  //playerO
            box.innerText = "O";
            box.style.color = "#b0413e";
            turnO = false;
        }
        else {  //playerX
            box.innerText = "X";
            box.style.color = "#98706f";
            turnO = true;
        }
        box.disabled = true;
        count++;
        line.classList.remove("hide");
        let isWinner = await checkWinner();
        if(count === 9 && !isWinner) {
            await delay();
            gameDraw();
        }
    });
});

const disableBoxes = () => {
    for(let box of boxes) {
        box.disabled = true;
    }
};

const enableBoxes = () => {
    for(let box of boxes) {
        box.disabled = false;
        box.innerText="";
    }
};

const showWinner = (winner) => {
    winSound.volume = 0.8;
    winSound.currentTime = 0;
    winSound.play();
    msg.innerText = `Congratulations!, Winner is ${winner}`;
    msgContainer.classList.remove("hide");
};

const gameDraw = () => {
    msg.innerText = "It's a draw..!";
    msgContainer.classList.remove("hide");
};

const delay = ()=>{
    return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            resolve();
        }, 2000);
    })
}

async function checkWinner () {
    for(let pattern of winPatterns) {
        let pos1Val = boxes[pattern[0]].innerText;
        let pos2Val = boxes[pattern[1]].innerText;
        let pos3Val = boxes[pattern[2]].innerText;

        if(pos1Val != "" && pos2Val != "" && pos3Val != "") {
            if(pos1Val === pos2Val && pos2Val === pos3Val) {
                disableBoxes();

                line.style.width = "57vmin";
                line.style.transform = `translate(${pattern[3]}vmin,${pattern[4]}vmin)rotate(${pattern[5]}deg)`;

                await delay();
                showWinner(pos1Val);
                return true;
            }
        }
    }
    return false;
};

newGameBtn.addEventListener("click",resetGame);
resetBtn.addEventListener("click",resetGame);