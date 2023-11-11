// let currentTileArray = [1, 2, 3, 4, 5, 6, 7, 0, 8]; //sorted for faster testing purposes
let currentTileArray = [1, 4, 5, 2, 3, 7, 8, 6, 0];
let finalState = "[1,2,3,4,5,6,7,8,0]";
let tilesBox = document.getElementById("tilesBox");
let numberButtons = document.getElementById("numberButtons");
let isWin = false;
let timerValue = 0;
let timerInterval;
const timerDisplay = document.getElementById("timerValue");

// vase tike beham rikhtan biya oni k karbar tarif karde ro beham mirizi
// counter and decending timer
const updateTimer = () => {
    timerValue++;
    timerDisplay.textContent = timerValue;
};

const resetTimer = () => {
    clearInterval(timerInterval);
    timerValue = 0;
    timerDisplay.textContent = timerValue;
};

const startTimer = () => {
    timerInterval = setInterval(updateTimer, 1000);
};

let initFinalState = () => {
    const valuesArray = [];
    for (let i = 1; i <= 9; i++) {
        const element = document.getElementById(`tile${i}`);
        const value = element.value;
        valuesArray.push(value);
    }
    return JSON.stringify(valuesArray)
}


// compare current state with final state
let checkGameState = (arr) => {
    // console.log(arr,JSON.parse(finalState))
    //
    // console.log(JSON.stringify(arr),finalState)
    // JSON.stringify(arr) === finalState
    const stringArray = arr.map((num) => num.toString());
    console.log(JSON.stringify(arr), finalState)
    let count=document.getElementById('counter').innerHTML
    // let test='["'+arr.join(',').toString()+'"]'
    // console.log(test)

    if (JSON.stringify(stringArray) === finalState) {
        let message=`You winned with ${count} moves and ${timerDisplay.innerHTML} seconds time`
        alert(message);
        reset();
    }
};


let equalArrays = (array1, array2) => {
    if (array1.length !== array2.length)
        return false

    for (let i = 0; i < array1.length; i++) {
        if (array1[i] !== array2[i])
            return false
    }
    return true
}

let checkInversion = (arr) => {
    let invCount = 0;
    for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[j] && arr[i] && arr[i] > arr[j]) {
                invCount++;
            }
        }
    }
    return invCount;
};

let isSolvable = (currentTileArray) => {
    let inversions = checkInversion(currentTileArray);
    if (inversions % 2 == 0) {
        return true;
    }
    return false;
};


let getRandomIntBetweenRange = (min, max) => {
    return Math.floor(Math.random(min, max) * (max - min + 1) + min);
};

let shuffleArray = (arr) => {
    for (let i = arr.length - 1; i > 0; i--) {
        let numberBetweenRange = getRandomIntBetweenRange(0, i);
        temp = arr[i];
        arr[i] = arr[numberBetweenRange];
        arr[numberBetweenRange] = temp;
    }
    return arr;
};

let renderUi = function (flag) {
    let initialRender = flag;
    if (initialRender) {
        initPuzzleTiles();
    } else {
        repaint();
    }
};

let shuffleAndReset = () => {
    let preGameShuffle = shuffleArray(currentTileArray);
    let isGameSolvable = isSolvable(preGameShuffle);
    if (isGameSolvable) {
        currentTileArray = preGameShuffle;
    } else {
        reset();
    }

}
let reset = () => {
    // console.log(currentTileArray);
    // console.log(shuffleArray(currentTileArray))

    shuffleAndReset()
    finalState = initFinalState()
    isWin = false;
    renderUi(false);
    document.getElementById('counter').innerText = '0'
    resetTimer()
    startTimer()
};

let initPuzzleTiles = function () {
    let resetButton = document.createElement("button");
    numberButtons.appendChild(resetButton);
    resetButton.classList.add("reset_btn");
    resetButton.style.backgroundColor = 'transparent';
    resetButton.style.backgroundImage = 'linear-gradient(to bottom, #3498db, #2980b9)';
    resetButton.style.color = 'white';
    resetButton.style.border = 'none';
    resetButton.style.borderRadius = '10px';
    resetButton.style.cursor = 'pointer';
    resetButton.innerText = "شروع";
    resetButton.addEventListener("click", reset);

    for (var i = 0; i < 9; i++) {
        let number_div = document.createElement("div");
        tilesBox.appendChild(number_div);
        number_div.classList.add("number-block");
        number_div.setAttribute("data-number", currentTileArray[i]);
        number_div.setAttribute("data-index", i);
        number_div.innerText = number_div.getAttribute("data-number");
        number_div.classList.add("number_class");
        number_div.addEventListener("click", evaluate);
        if (currentTileArray[i] === 0) {
            number_div.classList.add("void_class");
        }
    }
};

let repaint = () => {
    willRepaintGame
        .then(function () {
            let numberBlocks = document.getElementsByClassName("number-block");
            for (let key in numberBlocks) {
                if (typeof numberBlocks[key] === "object") {
                    numberBlocks[key].setAttribute("data-number", currentTileArray[key]);
                    numberBlocks[key].innerText =
                        numberBlocks[key].getAttribute("data-number");
                    if (numberBlocks[key].classList.contains("void_class")) {
                        numberBlocks[key].classList.remove("void_class");
                    } else if (currentTileArray[key] === 0) {
                        numberBlocks[key].classList.add("void_class");
                    }
                }
            }
        })
        .then(function () {
            setTimeout(function () {
                document.getElementById('counter').innerText++
                checkGameState(currentTileArray);
            }, 100);
        });
};

// always resolve
let willRepaintGame = new Promise((resolve, reject) => {
    resolve();
});

let swapFunction = function (temp, arr, i, j) {
    temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
    temp = null;
    return temp, arr;
};

let evaluate = function (e) {


    let currNumClicked = parseInt(e.target.dataset.number);
    if (currNumClicked === 0) return false;

    let temp;
    // clone existing game state
    let numberState = currentTileArray;
    // current position in array
    let indexOfNumber = numberState.indexOf(currNumClicked);


    let voidCases = [2, 3, 5, 6];
    let targetElementIndex = parseInt(e.target.dataset.index);


    if (voidCases.indexOf(targetElementIndex) >= 0) {
        if (targetElementIndex === 2 || targetElementIndex === 5) {
            if (numberState[indexOfNumber + 1] === 0) return false;
        } else if (targetElementIndex === 3 || targetElementIndex === 6) {
            if (numberState[indexOfNumber - 1] === 0) return false;
        }
    }

    //if the number clicked is at index 0
    if (indexOfNumber === 0) {
        if (numberState[1] === 0) {
            temp, (numberState = swapFunction(temp, numberState, 1, 0));
        } else if (numberState[3] === 0) {
            temp = numberState[3];
            numberState[3] = numberState[0];
            numberState[0] = temp;
            temp = null;
        }
    }

    if (indexOfNumber >= 1 && indexOfNumber <= 8) {
        //check for 0
        if (numberState[indexOfNumber - 1] === 0) {
            //  LEFT
            temp,
                (numberState = swapFunction(
                    temp,
                    numberState,
                    indexOfNumber - 1,
                    indexOfNumber
                ));
        } else if (numberState[indexOfNumber + 1] === 0) {
            //  RIGHT
            temp,
                (numberState = swapFunction(
                    temp,
                    numberState,
                    indexOfNumber + 1,
                    indexOfNumber
                ));
        } else if (numberState[indexOfNumber + 3] === 0) {
            // Down
            temp,
                (numberState = swapFunction(
                    temp,
                    numberState,
                    indexOfNumber + 3,
                    indexOfNumber
                ));
        } else if (numberState[indexOfNumber - 3] === 0) {
            // UP
            temp,
                (numberState = swapFunction(
                    temp,
                    numberState,
                    indexOfNumber - 3,
                    indexOfNumber
                ));
        } else {
            return false;
        }
    }
    currentTileArray = numberState;
    //check for game State
    renderUi(false);
};

// Start the game
initFinalState()
renderUi(true);
