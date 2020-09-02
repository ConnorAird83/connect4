function createColumnListeners (rows, columns) {
    for (let i=0; i<rows; i++) {
        for (let j=0; j<columns; j++) {
            
            $("#row-"+i+"-column-"+j).click(function () {
                if (gameInProgress) {        
                    console.log("someone clicked")
                    // console.log(board)
                    let coords = placeCounter(board, j, player)
                    
                    if (coords[0] !== null) {
                        console.log(""+board)
                        board[coords[0]][coords[1]] = player
                        console.log(""+board)
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
}

function removeColumnListeners () {
    $(".column").unbind()
}

//Initialise game variables
let board = []
let rowArray = []
let player1wins = 0
let player2wins = 0 
let player = "red"
let numberOfTurns = 0
let gameInProgress = true
let rows = 6
let columns = 7

// draw the circles on the window and create the board data structure 
$("#draw-board").click(function () {
    //delete circles and remove their listeners 
    $(".row").remove()
    removeColumnListeners()

    rows = $("#num-rows").val()
    columns = $("#num-columns").val() 
    drawGrid(rows, columns)
    for (let i=0; i<columns; i++) {
        rowArray.push(null)
    }
    for (let j=0; j<rows; j++){
        board.push(rowArray)
    }
    
    createColumnListeners(rows, columns)
    
})
    
//listen for click of reset button
$("#reset-button").click(function () {
    board = cleanBoard(rows, columns)
    gameInProgress = true
    $(".circle").css("background-color", "white")
    $("#winner-display").css("display", "none")
})

