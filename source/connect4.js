function placeCounter(board, column) {
  // loop over rows starting from the bottom
  for (let row = board.length - 1; row >= 0; row -= 1) {
    // if the appropriate cell is free return it's  position
    if (board[row][column] === null) {
      return row;
    }
  }
  return null;
}

function cleanBoard(rows, columns) {
  // console.log('reset game was called');
  const rowArray = [];
  const board = [];
  for (let i = 0; i < columns; i += 1) {
    rowArray.push(null);
  }
  for (let j = 0; j < rows; j += 1) {
    board.push(rowArray);
  }
  return board;
}

function checkWinner(board) {
  // console.log('checkWinner was called');
  let winner = null;
  let redCount = 0;
  let yellowCount = 0;

  /* check for row win */
  // fills an array with a string of the first letters of each element in each row (r, y or n)
  const rowStringsArray = board.map((row) => row.reduce((string, column) => {
    if (column === null) {
      return `${string}n`;
    }
    return `${string}${column[0]}`;
  }, ''));
  // if a row includes a string of 4 r's or y's set winner to 'red' or 'yellow' respectively
  winner = rowStringsArray.reduce((result, row) => {
    let tempResult = null;
    // only edit the returned value if a winner has not yet been found
    if (result === null) {
      // if four r's or y's are found in a row edit the returned result as appropriate
      if (row.includes('rrrr')) {
        tempResult = 'red';
      } else if (row.includes('yyyy')) {
        tempResult = 'yellow';
      }
      return tempResult;
    }
    // Will return here if the winner has already been found
    return result;
  }, null);

  if (winner !== null) {
    return winner;
  }

  /* check for column wins */
  // loop over columns
  for (let column = 0; column < board[0].length; column += 1) {
    // loop over rows (bottom to top)
    for (let row = board.length - 1; row >= 0; row -= 1) {
      if (redCount >= 4 || yellowCount >= 4) {
        return winner;
      // eslint-disable-next-line no-else-return
      } else if (board[row][column] === null) {
        redCount = 0;
        yellowCount = 0;
        winner = null;
      } else if (board[row][column] === 'red') {
        redCount += 1;
        yellowCount = 0;
        winner = 'red';
      } else if (board[row][column] === 'yellow') {
        yellowCount += 1;
        redCount = 0;
        winner = 'yellow';
      } else {
        // eslint-disable-next-line no-console
        console.log(`Incorrect variable in board at (${row}, ${column})`);
      }
    }
    // check for 4 or more in row
    if (redCount >= 4 || yellowCount >= 4) {
      return winner;
    // eslint-disable-next-line no-else-return
    } else {
      redCount = 0;
      yellowCount = 0;
    }
  }

  winner = null;

  /* Check for diagonal wins */
  // loop over rows
  for (let row = 0; row < board.length - 3; row += 1) {
    let leftCounter = 0;
    let rightCounter = board[0].length - 1;
    // loop over columns
    for (let column = 0; column < board[0].length - 3; column += 1) {
      // console.log("row = "+row+" leftCounter = "+leftCounter+" rightCounter = "+rightCounter)
      // if a colour is encountered
      if (board[row][leftCounter] !== null) {
        winner = board[row][leftCounter];
        // if there is four in a diagonal down to the right return the winner
        if (
          (board[row][leftCounter] === board[row + 1][leftCounter + 1])
          && (board[row + 1][leftCounter + 1] === board[row + 2][leftCounter + 2])
          && (board[row + 2][leftCounter + 2] === board[row + 3][leftCounter + 3])) {
          return winner;
        }
      }
      // if a colour is encountered
      if (board[row][rightCounter] !== null) {
        winner = board[row][rightCounter];
        // if there is four in a diagonal down to the left return the winner
        if (
          (board[row][rightCounter] === board[row + 1][rightCounter - 1])
          && (board[row + 1][rightCounter - 1] === board[row + 2][rightCounter - 2])
          && (board[row + 2][rightCounter - 2] === board[row + 3][rightCounter - 3])) {
          return winner;
        }
      }
      // increment counters to test for diagonals to the left and right
      leftCounter += 1;
      rightCounter -= 1;
    }
  }

  /* check for nobody winning */
  // only true is every column in every row is not null
  if (board.every((row) => row.every((cell) => cell !== null))) {
    return 'nobody';
  }

  // if no winner has been encountered return null
  return null;
}

function getCurrentPlayer(board) {
  // get 1D version of board
  const flatBoard = board.flat();

  const counters = flatBoard.reduce((acc, cell) => {
    if (cell !== null) {
      // eslint-disable-next-line no-param-reassign
      acc += 1;
    }
    return acc;
  }, 0);

  // if an even number of turns have been played it is reds turn else yellows
  if (counters % 2 === 0) {
    return 'red';
  }
  return 'yellow';
}

// module = module || {};
module.exports = {
  checkWinner,
  cleanBoard,
  placeCounter,
  getCurrentPlayer,
};
