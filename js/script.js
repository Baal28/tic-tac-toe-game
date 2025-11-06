//IIFE for GAMEBOARD module
const GAMEBOARD = (function(){
    //Private state goes here
    const gameBoard = Array(9).fill('') // Initializing a 3x3 board

    //The function MUST return an object {}
    return {
        //Public methods goes here
        getBoard: function(){
            return gameBoard; // This method is a closure over the private 'gameBoard'

        },
        markSpot: function(index,marker){
            if (gameBoard[index] === '') {
                //marker = 'X' or 'O'
                gameBoard[index] = marker;
                return true;
            } else {
                //spot is taken select another spot
                return false;
            }
        },
        resetBoard: function () {
             gameBoard.fill('')
        },

    };
})();

//Factory Function for Player
function createPlayer (name,marker){
    return {name, marker};
};



//IIFE for 'GAME_CONTROLLER' module
const GAME_CONTROLLER = (function () {
    //Private state goes here
    let playerX; //= createPlayer('Zakk', 'X');
    let playerO; //= createPlayer('Myles', 'O');
    let currentPlayer = playerX;
    let gameStatus = true;
    const WIN_COMBINATIONS = [
        //Rows  //Columns //Diagonal
        [0,1,2], [0,3,6], [0,4,8],
        [3,4,5], [1,4,7], [2,4,6],
        [6,7,8], [2,5,8],     
    ]; 
    // Private Functions
    function checkForWin() {
        //get the current board state
        const board = GAMEBOARD.getBoard();
        //Loop and check for wins
        for (const combination of WIN_COMBINATIONS) {
            const [a, b, c] = combination;

            if (board[a] !== '' && board[a] === board[b] && board[a] === board[c]) {
                return true;
            }
        }
        return false;
    }

     function switchTurn () {
            if (currentPlayer.marker === 'X') {
                currentPlayer = playerO;
            } else {
                currentPlayer = playerX;
            }  
            DISPLAY_CONTROLLER.updateTurnDisplay();
        }
    // The function Must return an object
    return{
        //Public methods goes here
        getTurn: function(){
            if (currentPlayer === playerX) {
                return playerX
            } else {
                return playerO
            }
        },
        /*switchTurn: function () {
            if (currentPlayer.marker === 'X') {
                currentPlayer = playerO;
            } else {
                currentPlayer = playerX;
            }  
            DISPLAY_CONTROLLER.updateTurnDisplay();
        },*/
        playerChoice: function(index){
            if (gameStatus === false) {
                return;
            }
            const marker = currentPlayer.marker;
            const moveSuccesful = GAMEBOARD.markSpot(index,marker);
            //checks if markSpot returned true so it can change turns.
            if (moveSuccesful === true) {
                DISPLAY_CONTROLLER.updateDisplay();

                const isWin = checkForWin();
                const isDraw = !GAMEBOARD.getBoard().includes('');

                if (isWin) {
                    gameStatus = false;
                    return DISPLAY_CONTROLLER.displayMessage(`${currentPlayer.name} Wins!`)
                } else if (isDraw) {
                    gameStatus = false;
                    return DISPLAY_CONTROLLER.displayMessage(`Game Over: Draw!`)
                } else {
                    switchTurn();
                }
            };
        },
        initializeGame: function (nameX,nameO) {
           playerX = createPlayer(nameX, 'X');
           playerO = createPlayer(nameO, 'O');
           currentPlayer = playerX;
           DISPLAY_CONTROLLER.updateDisplay();
           DISPLAY_CONTROLLER.updateTurnDisplay();
        },
        restartGame: function () {
          const winner = document.querySelector('.winner');
          const displayTurn = document.querySelector('.turn-display');  
          GAMEBOARD.resetBoard();
          currentPlayer = playerX;
          gameStatus = true;
          winner.textContent = '';
          displayTurn.textContent = '';
          DISPLAY_CONTROLLER.updateDisplay();  
          DISPLAY_CONTROLLER.updateTurnDisplay();
        },
    };
})();

//IIFE for 'DISPLAY_CONTROLLER' module
const DISPLAY_CONTROLLER = (function () {
    //Private state goes here
    let boardContainer = document.querySelector('.gameboard-container');
    let restartBtn = document.querySelector('.restart-button');
    let dialog = document.querySelector('dialog');
    let startBtn = document.querySelector('#start-btn');
    let PlayerX = document.querySelector('#PlayerX')
    let PlayerO = document.querySelector('#PlayerO')
    let winnerDisplayElement = document.querySelector('.winner');
    //Private Functions below
    function handleClick(e) {
        let index = e.target.dataset.index;
        GAME_CONTROLLER.playerChoice(index);
    }

    function setupEventListeners() {
        boardContainer.addEventListener('click', handleClick);
    }
    setupEventListeners();

    function setUpRestartButton() {
        restartBtn.addEventListener('click',GAME_CONTROLLER.restartGame);
    }
    setUpRestartButton();

    function setUpStartButton() {
        dialog.showModal();
        startBtn.addEventListener('click', (e) => {
            e.preventDefault();

            const nameX = PlayerX.value;
            const nameO = PlayerO.value;

            if (nameX === '' || nameO === '') {
                alert('please insert players names');
                return
            }

            GAME_CONTROLLER.initializeGame(nameX,nameO);
                    

            dialog.close();
        });
    }
    setUpStartButton();

    //The function MUST return an object {}
    return{
        updateDisplay: function () {
            let currentBoard = GAMEBOARD.getBoard();
            //Clear the container
            boardContainer.innerHTML = '';
            //Iterate and render
            currentBoard.forEach((marker, index) => {
                const cellElement = document.createElement('div');
                cellElement.setAttribute('data-index', index)
                cellElement.classList.add('cell');

                cellElement.innerHTML = `
                    <div class="${marker === 'X' ? 'x-marker' : 'o-marker'}">${marker}</div>
                `;

                boardContainer.appendChild(cellElement);
            });
        },
        displayMessage: function (message){
            const displayTurn = document.querySelector('.turn-display');
            winnerDisplayElement.textContent = message;
            displayTurn.textContent = ''; 
        },
        updateTurnDisplay: function () {
            const currentPlayer = GAME_CONTROLLER.getTurn();
            const displayTurn = document.querySelector('.turn-display');

            displayTurn.textContent = `It's ${currentPlayer.name} turn`;
        }

    }
})();