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
let gameInProgress = true


//listen for click on cells
for (let i=0; i<board.length; i++) {
    for (let j=0; j<board[0].length; j++) {

        $("#row-"+i+"-column-"+j).click(function () {
            if (gameInProgress) {                
                let coords = placeCounter(board, j, player)
                
                if (coords[0] !== null) {
                    board[coords[0]][coords[1]] = player
                    $("#circle-row-"+coords[0]+"-column-"+coords[1]).css("background-color", player)
                }

                if (player === "red") {
                    player = "yellow"
                } else if (player === "yellow") {
                    player = "red"
                }
                let winner = checkWinner(board)
                if (winner !== null) {
                    gameInProgress = false
                    $("#winner-name").text(winner)
                    $("#winner-display").css("display", "block")
                }
            }
        })
    }
}

//listen for click of reset button
$("#reset-button").click(function () {
    board = resetGame()
    gameInProgress = true
    $(".circle").css("background-color", "white")
    $("#winner-display").css("display", "none")
})

