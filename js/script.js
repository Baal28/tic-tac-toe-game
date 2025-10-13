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
    // Private Functions
    function checkForWin() {
        //logic here
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
            const marker = currentPlayer.marker;
            const moveSuccesful = GAMEBOARD.markSpot(index,marker);
            //checks if markSpot returned true so it can change turns.
            if (moveSuccesful === true) {
                GAME_CONTROLLER.switchTurn();
                DISPLAY_CONTROLLER.updateDisplay();
            }
        },
    };
})();

//IIFE for 'DISPLAY_CONTROLLER'
const DISPLAY_CONTROLLER = (function () {
    //Private state goes here
    let boardContainer = document.querySelector('.gameboard-container');
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
    }
})();