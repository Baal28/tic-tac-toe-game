//IIFE for GAMEBOARD
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

    };
})();

//Factory Function for Player
function createPlayer (name,marker){
    return {name, marker};
};



//IIFE for 'GAME_CONTROLLER' module
const GAME_CONTROLLER = (function () {
    //Private state goes here
    const playerX = createPlayer('Zakk', 'X');
    const playerO = createPlayer('Myles', 'O');
    let currentPlayer = playerX;
    let gameStatus = true;
    const WIN_COMBINATIONS = [
        //Rows  //Columns //Diagonal
        [0,1,2], [0,3,6], [0,4,8],
        [3,4,5], [1,4,7], [2,4,6]
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
        switchTurn: function () {
            if (currentPlayer === playerX) {
                currentPlayer = playerO;
            } else {
                currentPlayer = playerX;
            }  
        },
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
                    GAME_CONTROLLER.switchTurn();
                }
            };
        },
    };
})();

//IIFE for 'DISPLAY_CONTROLLER'
const DISPLAY_CONTROLLER = (function () {
    //Private state goes here
    let boardContainer = document.querySelector('.gameboard-container');

    //Private Functions below
    function handleClick(e) {
        let index = e.target.dataset.index;
        GAME_CONTROLLER.playerChoice(index);
    }

    function setupEventListeners() {
        boardContainer.addEventListener('click', handleClick);
    }
    setupEventListeners();

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

                cellElement.innerHTML = `
                    <div>${marker}</div>
                `;

                boardContainer.appendChild(cellElement);
            });
        },
        displayMessage: function (message){
            alert(message);
        }
    }
})();