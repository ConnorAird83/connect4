const fs = require('fs').promises;

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

function cleanBoard(board) {
  const newBoard = board.slice();
  for (let i = 0; i < newBoard.length; i += 1) {
    for (let j = 0; j < newBoard[i].length; j += 1) {
      newBoard[i][j] = null;
    }
  }
  return newBoard;
}

function checkWinner(board, target) {
  // console.log('checkWinner was called');
  let winner = null;
  let redString = '';
  let yellowString = '';

  for (let i = 0; i < target; i += 1) {
    redString = `${redString}r`;
    yellowString = `${yellowString}y`;
  }

  /* check for row win */
  // fills an array with a string of the first letters of each element in each row (r, y or n)
  winner = board
    .map((row) => row.reduce((string, column) => {
      if (column === null) {
        return `${string}n`;
      }
      return `${string}${column[0]}`;
    }, ''))
    // if a row includes a string of 4 r's or y's set winner to 'red' or 'yellow' respectively
    .reduce((result, row) => {
      // console.log(result, redString);
      let tempResult = null;
      // only edit the returned value if a winner has not yet been found
      if (result === null) {
        // if four r's or y's are found in a row edit the returned result as appropriate
        if (row.includes(redString)) {
          tempResult = 'red';
        } else if (row.includes(yellowString)) {
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

  winner = null;

  /* check for column wins */
  // fill a new array with the board data but place row cells inside column arrays
  let count = 0;
  const newBoard = [];
  board.flat().forEach((circle) => {
    const column = count % board[0].length;
    if (count < board[0].length) {
      newBoard.push([]);
    }
    newBoard[column].unshift(`${circle}`);
    count += 1;
  });

  // now use same approach as for checking row wins
  winner = newBoard
    .map((column) => column.reduce((string, row) => {
      if (row === null) {
        return `${string}n`;
      }
      return `${string}${row[0]}`;
    }, ''))
    .reduce((result, column) => {
      let tempResult = null;
      // only edit the returned value if a winner has not yet been found
      if (result === null) {
        // if four r's or y's are found in a row edit the returned result as appropriate
        if (column.includes(redString)) {
          tempResult = 'red';
        } else if (column.includes(yellowString)) {
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

  winner = null;

  /* Check for diagonal wins */
  // loop over rows
  for (let row = 0; row < board.length - target + 1; row += 1) {
    let leftCounter = 0;
    let rightCounter = board[0].length - 1;
    // loop over columns
    for (let column = 0; column < board[0].length - target + 1; column += 1) {
      // console.log(row, column);
      // if a colour is encountered
      if (board[row][leftCounter] !== null) {
        winner = board[row][leftCounter];
        for (let i = 0; i < target; i += 1) {
          if (i === target - 1) {
            return winner;
          }
          // if there is target in a diagonal down to the right return the winner
          if (board[row + i][leftCounter + i] !== board[row + i + 1][leftCounter + i + 1]) {
            break;
          }
        }
      }
      // if a colour is encountered
      if (board[row][rightCounter] !== null) {
        winner = board[row][rightCounter];
        for (let i = 0; i < target; i += 1) {
          if (i === target - 1) {
            return winner;
          }
          // if there is target in a diagonal down to the left return the winner
          if (board[row + i][rightCounter - i] !== board[row + i + 1][rightCounter - i - 1]) {
            break;
          }
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

function getCurrentPlayer(board, starter) {
  // get 1D version of board
  const flatBoard = board.flat();
  let otherPlayer = 'yellow';

  if (starter === 'yellow') {
    otherPlayer = 'red';
  }

  const counters = flatBoard.reduce((acc, cell) => {
    if (cell !== null) {
      // eslint-disable-next-line no-param-reassign
      acc += 1;
    }
    return acc;
  }, 0);

  // if an even number of turns have been played it is reds turn else yellows
  if (counters % 2 === 0) {
    return starter;
  }
  return otherPlayer;
}

function createDataBoard(rows, columns) {
  const newBoard = [];
  for (let i = 0; i < rows; i += 1) {
    const newRow = [];
    for (let j = 0; j < columns; j += 1) {
      newRow.push(null);
    }
    newBoard.push(newRow);
  }
  return newBoard;
}

function updateDataFile(storedGames, gameInQuestion, id) {
  const copyOfGames = { ...storedGames };
  // update the appropriate game in storedGames and then write out to the data file
  copyOfGames.forEach((game) => {
    const index = copyOfGames.indexOf(game);
    if (game.id === id) {
      copyOfGames[index] = { ...gameInQuestion };
    }
  });
  fs.writeFile(
    './data/games.json',
    JSON.stringify(copyOfGames),
    'utf-8',
  );
}

// gets the existing boards from the data file
async function getGames() {
  try {
    await fs.access('./data/games.json');

    const output = await fs.readFile('./data/games.json', 'utf-8')
      .then((fileData) => JSON.parse(fileData));

    return output;
  } catch (error) {
    // if the file doesn't exist create it and return an empty array
    await fs.writeFile(
      './data/games.json',
      '[]',
      'utf-8',
    );
    return [];
  }
}

function newGameState(newBoard, newTarget, gameId) {
  return {
    board: newBoard.slice(),
    target: newTarget,
    firstPlayer: 'red',
    redScore: 0,
    yellowScore: 0,
    id: gameId,
  };
}

// swap the starting player
async function swapFirstPlayer(id) {
  const storedGames = await getGames();
  getTheGame(id)
    .then((game) => {
      const newGame = { ...game };
      if (newGame.firstPlayer === 'red') {
        newGame.firstPlayer = 'yellow';
      } else {
        newGame.firstPlayer = 'red';
      }
      return newGame;
    })
    .then((finishedGame) => {
      updateDataFile(storedGames, finishedGame, id);
    });
}

// module = module || {};
module.exports = {
  checkWinner,
  cleanBoard,
  placeCounter,
  getCurrentPlayer,
  createDataBoard,
  updateDataFile,
  getGames,
  // getTheGame,
  newGameState,
  swapFirstPlayer,
};
