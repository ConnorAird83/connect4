function drawGrid (numberOfRows, numberOfColumns) {
    console.log("drawGrid was called")
    const grid = document.getElementById("game-board")
    for (let i=0; i<numberOfRows; i++){
        $("#game-board").append("<div class='row' id='row-"+i+"'></div>")
        for (let j=0; j<numberOfColumns; j++){
            $("#row-"+i).append("<div class='column' id='row-"+i+"-column-"+j+"'></div>")
            $("#row-"+i+"-column-"+j).append("<div class='circle' id='circle-row-"+i+"-column-"+j+"'></div>")
        }
    }
}

function placeCounter(board, column, colour) {
    console.log("placeCounter was called")
    const newBoard = board
    // loop over rows starting from the bottom 
    for (let row=board.length-1; row >= 0; row--) {
        // if the appropriate cell is free place a cirlce
        if (board[row][column] === null) {
            return [row,column]
        }
    }
    return [null,null]
}

function resetGame(){
    console.log("reset game was called")
    return [
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null],
        [null,null,null,null,null,null,null]
    ]
}

function checkWinner(board) {
    console.log("checkWinner was called")
    let winner = null
    let redCount = 0
    let yellowCount = 0

    /* check for row win */
    // loop over rows
    for (let row=board.length-1; row >= 0; row--) {
        // loop over columns
        for (let column=0; column<board[0].length; column++) {
            if (redCount >= 4 || yellowCount >= 4) {
                return winner
            } else if (board[row][column] === null) {
                redCount = 0
                yellowCount = 0
                winner = null
            } else if (board[row][column] === "red") {
                redCount += 1
                yellowCount = 0
                winner = "red"
            } else if (board[row][column] === "yellow") {
                yellowCount += 1
                redCount = 0
                winner = "yellow"
            } else {
                console.log("Incorrect variable in board at ("+row+", "+column+")")
            }
        }
        //check for 4 or more in row 
        if (redCount >= 4 || yellowCount >= 4) {
            return winner
        } else {
            redCount = 0
            yellowCount = 0
        }
    }

    redCount = 0
    yellowCount = 0
    winner = null

    /* check for column wins */
    // loop over columns
    for (let column=0; column<board[0].length; column++) {
        // loop over rows (bottom to top)
        for (let row=board.length-1; row >= 0; row--) {
            if (redCount >= 4 || yellowCount >= 4) {
                return winner
            } else if (board[row][column] === null) {
                redCount = 0
                yellowCount = 0
                winner = null
            } else if (board[row][column] === "red") {
                redCount += 1
                yellowCount = 0
                winner = "red"
            } else if (board[row][column] === "yellow") {
                yellowCount += 1
                redCount = 0
                winner = "yellow"
            } else {
                console.log("Incorrect variable in board at ("+row+", "+column+")")
            }
        }
        //check for 4 or more in row 
        if (redCount >= 4 || yellowCount >= 4) {
            return winner
        } else {
            redCount = 0
            yellowCount = 0
        }
    }

    winner = null

    /* Check for diagonal wins */
    // loop over rows
    for (let row=0; row < board.length-3; row++) {
        let leftCounter = 0
        let rightCounter = board[0].length-1
        // loop over columns
        for (let column=0; column < board[0].length-3; column++) {
            // console.log("row = "+row+" leftCounter = "+leftCounter+" rightCounter = "+rightCounter)
            // if a colour is encountered
            if (board[row][leftCounter] !== null) {
                winner = board[row][leftCounter]
                // if there is four in a diagonal down to the right return the winner 
                if ((board[row][leftCounter] === board[row+1][leftCounter+1]) && (board[row+1][leftCounter+1] === board[row+2][leftCounter+2]) && (board[row+2][leftCounter+2] === board[row+3][leftCounter+3])) {
                    return winner
                }
            }
            // if a colour is encountered
            if (board[row][rightCounter] !== null) {
                winner = board[row][rightCounter]
                // if there is four in a diagonal down to the left return the winner
                if ((board[row][rightCounter] === board[row+1][rightCounter-1]) && (board[row+1][rightCounter-1] === board[row+2][rightCounter-2]) && (board[row+2][rightCounter-2] === board[row+3][rightCounter-3])) {
                    return winner
                }
            }
            //increment counters to test for diagonals to the left and right
            leftCounter += 1
            rightCounter -= 1
        }
    }
    // if no winner has been encountered return null
    return null
}

module = module || {};
module.exports = {
    drawGrid: drawGrid,
    checkWinner: checkWinner,
    resetGame: resetGame,
    placeCounter: placeCounter,
}