const port = 3004;
let gameId = '0';
let gameBoard = [];
let firstPlayer = 'red';

async function getRow(board, column) {
  // check the board is the correct type
  if (!Array.isArray(board)) {
    throw new Error('Board must be a 2D array');
  }
  // check for a valid column value
  if ((typeof column) !== 'number' || column < 0) {
    throw new Error('Column must be a positive integer');
  } else if (column > board[0].length) {
    throw new Error('Column out of range');
  }

  // loop over rows starting from the bottom
  for (let row = board.length - 1; row >= 0; row -= 1) {
    // if the appropriate cell is free return it's  position
    if (board[row][column] === null) {
      return row;
    }
  }
  return null;
}

function getCurrentPlayer(board, starter) {
  // check for valid starter inputs
  if ((starter !== 'red') && (starter !== 'yellow')) {
    throw new Error('starter must be a string containing either red or yellow');
  }
  // check for valid board inputs
  if (!Array.isArray(board)) {
    throw new Error('board must be a 2D array');
  }

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

function drawGrid(board) {
  const numberOfRows = board.length;
  const numberOfColumns = board[0].length;
  // loop over the number of rows
  for (let i = 0; i < numberOfRows; i += 1) {
    // add a row div to the existing game board
    $('#game-board').append(`<div class="row" id="row-${i}"></div>`);

    // loop over the number of columns
    for (let j = 0; j < numberOfColumns; j += 1) {
      // add a column div into the newly created row div
      $(`#row-${i}`).append(`<div class="column" id="row-${i}-column-${j}"></div>`);

      // add a circle div into the newly created column div and set its colour
      $(`#row-${i}-column-${j}`).append(`<div class='circle' id='circle-row-${i}-column-${j}'></div>`);
      if (board[i][j] !== null) {
        $(`#circle-row-${i}-column-${j}`).css('background-color', board[i][j]);
      }

      // set the size of the columns and circles to fit the game board
      const columnWidth = 100 / numberOfColumns;
      $(`#row-${i}-column-${j}`).css('width', `${columnWidth}%`);
    }
  }
}

function updateScreenBoard(row, column, player) {
  $(`#circle-row-${row}-column-${column}`).css('background-color', player).css('opacity', 1);
}

function updateWinCounts(winner, state) {
  // update each players win count
  if (winner !== 'nobody') {
    $('#winner-display').css('color', winner);
    const element = $(`#${winner}-win-count`);
    const currentValue = state[`${winner}Score`];
    element.text(currentValue);
  }
  // display the winner on the screen
  $('#winner-display').fadeIn(200);
  $('#winner-display').fadeOut(1000);
}

async function placeCounter(state, row, column) {
  const { player } = state;

  // update the screen
  updateScreenBoard(row, column, player);

  // get the new winner
  const winner = await fetch(`/winner/${gameId}`)
    .then((response) => response.json())
    .then((winArray) => winArray[0]);

  return winner;
}

async function getEmptyRow(state, column) {
  const row = await fetch(`/place/${gameId}/${column}/true`, {
    method: 'POST',
  }).then((response) => response.json());

  return row;
}

async function columnClicked(event) {
  // gets the id of the lowest child (target) in the mouse click event
  const column = parseInt(event.currentTarget.id.split('-')[3], 10);

  // get the current state
  const currentState = await fetch(`/getState/${gameId}`)
    .then((response) => response.json());

  const firstWinner = currentState.winner;

  // if no winner has been found yet
  if (firstWinner === null) {
    // test if a counter can be placed in this column
    getEmptyRow(currentState, column)
      .then((row) => {
        // if one can be placed, do so and check for a winner
        if (row !== null) {
          return placeCounter(currentState, row, column);
        }
        return null;
      })
      .then((winner) => {
        // if a winner has now been found, swap the first player and update the win counts
        if (winner !== null) {
          // get the new game state
          fetch(`/getState/${gameId}`)
            .then((response) => response.json())
            .then((newState) => {
              updateWinCounts(winner, newState);
            });
        }
      });
  } else {
    $('#reset-button').animate({
      height: '2.5rem',
      width: '12rem',
    });
    $('#reset-button').animate({
      height: '2rem',
      width: '10rem',
    });
  }
}

async function mouseOn(event) {
  // get the current state
  const player = getCurrentPlayer(gameBoard, firstPlayer)

  // find the current column
  const column = parseInt(event.currentTarget.id.split('-')[3], 10);

  // find the first row with a free space and update the screen
  getRow(gameBoard, column)
    .then((row) => {
      // change the colour of that circle to pastille version of the colours
      if (row !== null) {
        if (player === 'red') {
          $(`#circle-row-${row}-column-${column}`).css('background-color', 'rgb(255, 0, 10)').css('opacity', 0.8);
        } else {
          $(`#circle-row-${row}-column-${column}`).css('background-color', 'rgb(255, 255, 10)').css('opacity', 0.8);
        }
      }
    })
}

function mouseOff(event) {
  // find the current column
  const column = parseInt(event.currentTarget.id.split('-')[3], 10);
  // find the first row with a free space
  getRow(gameBoard, column)
    .then((row) => {
      // change the colour of that circle back to white
      if (row !== null) {
        $(`#circle-row-${row}-column-${column}`).css('background-color', 'white').css('opacity', 1);
      }
    })
}

function setupListeners() {
  // get the child rows of game board as jQuery array
  const rowArray = $('#game-board').children();

  // loop through these rows adding event listeners to each (inc children)
  rowArray.each((row) => {
    const cells = $(`#${rowArray[row].id}`).children();
    cells.each((circle) => {
      $(`#${cells[circle].id}`).click(columnClicked);
      $(`#${cells[circle].id}`).hover(mouseOn, mouseOff);
    });
  });
}

function createBoards(board) {
  $('.row').remove();
  drawGrid(board);
  setupListeners();
}

function startGame(gameState) {
  createBoards(gameState.board);
  // set win counts
  const redWins = $('#red-win-count');
  const yellowWins = $('#yellow-win-count');
  redWins.text(gameState.redScore);
  yellowWins.text(gameState.yellowScore);
}

document.addEventListener('DOMContentLoaded', () => {
  // get the gameId
  $('#id-prompt').modal({ backdrop: 'static', keyboard: false });
  $('#submit-btn').click(() => {
    gameId = $('#game-id').val();
    const idElement = $('#gameId');
    idElement.text(gameId);
    // create inital boards
    setInterval(() => {
      fetch(`/beginGame/${gameId}`, {
        method: 'PUT',
      }).then((response) => response.json())
      .then((gameState) => {
        gameBoard = gameState.board;
        firstPlayer = gameState.firstPlayer;
        startGame(gameState);
      })
    }, 500);

    fetch(`/beginGame/${gameId}`, {
      method: 'PUT',
    }).then((response) => response.json())
      .then((gameState) => {
        gameBoard = gameState.board;
        firstPlayer = gameState.firstPlayer;
        startGame(gameState);
      })
      .then(() => {
        // draw the circles on the window and create the board data structure
        $('#draw-board').click(() => {
          // allow the placing of more counters
          $('#winner-display').css('color', 'black');

          // delete rows, columns, circles and their listeners
          $('.row').remove();

          // get user input
          const rowInput = $('#num-rows').val();
          const columnInput = $('#num-columns').val();
          const targetInput = $('#target-length').val();
          // if input has been provided change values
          const numberOfRows = (rowInput === '') ? 6 : rowInput;
          const numberOfColumns = (columnInput === '') ? 7 : columnInput;
          const targetValue = (targetInput === '') ? 4 : targetInput;
          $('#title').text(`Connect ${targetValue}`);

          // request to create a new board
          fetch(`/newBoard/${numberOfRows}/${numberOfColumns}/${targetValue}/${gameId}`, {
            method: 'PUT',
          }).then((response) => response.json())
            .then((board) => {
              createBoards(board);
            });
        });
      });
  });
});

// listen for click of reset button
$('#reset-button').click(() => {
  // allow the placing of more counters
  $('#winner-display').css('color', 'black');

  // set all board circle to white
  fetch(`/reset/${gameId}`, {
    method: 'PUT',
  });

  $('.circle').css('background-color', 'white').css('opacity', 1);

  // hide the winner banner
  $('#winner-display').css('display', 'none');
});


// module.exports = {
//   getRow,
//   getCurrentPlayer,
// };