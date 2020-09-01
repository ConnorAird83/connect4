drawGrid(6,7)

//Initialise game variables
let board = [
    [null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null]
]
let player1wins = 0
let player2wins = 0 
let player = "red"
let numberOfTurns = 0


//listen for click on column
for (let i=0; i<board.length; i++) {
    for (let j=0; j<board[0].length; j++) {
        const column = document.getElementById("row-"+i+"-column-"+j)
        column.addEventListener("click", function () {
            // Get banner for displaying the winning player and stop displaying 
            const winnerDisplay = document.getElementById("winner-display")
            winnerDisplay.style.display = "none"
                        
            board = placeCounter(board, j, player)
            if (player === "red") {
                player = "yellow"
            } else if (player === "yellow") {
                player = "red"
            }
            let winner = checkWinner(board)
            if (winner !== null) {
                updateDisplay(winner)
            }
        }, true)
    }
}

//listen for click of reset button
const resetGameButton= document.getElementById("reset-button")
resetGameButton.addEventListener("click", function () {resetGame(board)})
