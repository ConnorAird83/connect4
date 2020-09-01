function drawGrid (numberOfRows, numberOfColumns) {
    console.log("drawGrid was called")
    const grid = document.getElementById("grid")
    for (let i=0; i<numberOfRows; i++){
        //create a new row element
        let row = document.createElement("div")
        row.className = "row"
        row.id = "row-"+i
        //place row in grid
        grid.appendChild(row)
        for (let j=0; j<numberOfColumns; j++){
            //create column element
            let column = document.createElement("div")
            column.className= "column"
            column.id = "row-" + i + "-column-"+j;
            //create circle element
            const circle = document.createElement("div")
            circle.className = "circle"
            circle.id = "circle-row-"+i+"-column-"+j;
            //place circle in column
            column.appendChild(circle)
            //place column in row
            row.appendChild(column);
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
            console.log("row = "+row+" column = "+column)
            newBoard[row][column] = colour

            // get the current circle and change to the appropriate colour
            $("#circle-row-"+row+"-column-"+column).css("background-color", colour)

            return newBoard
        }
    }
    return newBoard
}

function resetGame(board){
    console.log("reset game was called")
    const newBoard = board
    for (i=0; i<board.length; i++){
        for(j=0; j<board[i].length; j++){
            newBoard[i][j] = null

            $("#circle-row-"+i+"-column-"+j).css("background-color", "white")
        }
    }
    return newBoard
    
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

function updateDisplay(winner) {
    console.log("updateDisplay was called")
    const winnerName = document.getElementById("winner-name");
    winnerName.innerText = winner;
    const winnerDisplay = document.getElementById("winner-display");
    winnerDisplay.style.display = "block";
    resetGame(board)

}

module = module || {};
module.exports = {
    drawGrid: drawGrid,
    checkWinner: checkWinner,
    resetGame: resetGame,
    placeCounter: placeCounter,
    updateDisplay: updateDisplay,
}