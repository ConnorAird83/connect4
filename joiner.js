// Initialise game variables
let board = [
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
];
let player = 'red';
let gameInProgress = true;
let rows = 6;
let columns = 7;

function drawGrid(numberOfRows, numberOfColumns) {
  // console.log('drawGrid was called');

  // loop over the number of rows
  for (let i = 0; i < numberOfRows; i += 1) {
    // add a row div to the existing game board
    $('#game-board').append(`<div class="row" id="row-${i}"></div>`);

    // loop over the number of columns
    for (let j = 0; j < numberOfColumns; j += 1) {
      // add a column div into the newly created row div
      $(`#row-${i}`).append(`<div class="column" id="row-${i}-column-${j}"></div>`);

      // add a circle div into the newly created column div
      $(`#row-${i}-column-${j}`).append(`<div class='circle' id='circle-row-${i}-column-${j}'></div>`);

      // set the size of the columns and circles to fit the game board
      const columnWidth = 100 / numberOfColumns;
      $(`#row-${i}-column-${j}`).css('width', `${columnWidth}%`);
    }
  }
}

function swapPlayer() {
  if (player === 'red') {
    player = 'yellow';
  } else if (player === 'yellow') {
    player = 'red';
  }
}

function updateDataBoard(row, column) {
  board[row][column] = player;
}

function updateScreenBoard(row, column) {
  $(`#circle-row-${row}-column-${column}`).css('background-color', player);
}

function removeColumnListeners() {
  $('.column').unbind();
}

function createDataBoard(rows, columns) {
  // clear the data board
  board = [];

  // loop through rows
  for (let i = 0; i < rows; i += 1) {
    // create new row array
    const rowArray = [];

    // loop through columns
    for (let j = 0; j < columns; j += 1) {
      // add columns as nulls into the newly created row
      rowArray.push(null);
    }
    // add the complete row into the data board
    board.push(rowArray);
  }
}

function columnClicked(event) {
  // console.log('columnClicked was called');

  // only execute if no one has won yet
  if (gameInProgress) {
    // gets the id of the lowest child (target) in the mouse click event
    const column = parseInt(event.target.id.split('-')[4], 10);

    // check if a counter can be placed
    const row = placeCounter(board, column);

    // if a counter can be placed
    if (row !== null) {
      // update the screen and data board
      updateDataBoard(row, column);
      updateScreenBoard(row, column);

      // swap the players
      swapPlayer();

      // check for a winner
      const winner = checkWinner(board);
      if (winner !== null) {
        // prevent further coin placing
        gameInProgress = false;

        // display the winner on the screen
        $('#winner-name').text(winner);
        $('#winner-display').css('display', 'block');
      }
    }
  } else {
    console.log('Game is over');
  }
}

function setupListeners() {
  // get the child rows of game board as jQuery array
  const rows = $('#game-board').children();

  // loop through these rows adding event listeners to each (inc children)
  rows.each((row) => {
    rows[row].onclick = columnClicked;
  });
}

function createBoards(rows, columns) {
  drawGrid(rows, columns);
  createDataBoard(rows, columns);
  setupListeners();
}

document.addEventListener('DOMContentLoaded', () => {
  // create inital boards
  createBoards(board.length, board[0].length);

  // draw the circles on the window and create the board data structure
  $('#draw-board').click(() => {
    // delete rows, columns, circles and their listeners
    $('.row').remove();

    // get rows and columns from user input
    rows = $('#num-rows').val();
    columns = $('#num-columns').val();

    // create user defined boards
    createBoards(rows, columns);
  });
});

// listen for click of reset button
$('#reset-button').click(() => {
  // allow the placing of more counters
  gameInProgress = true;

  // set all board circle to white
  $('.circle').css('background-color', 'white');

  // hide the winner banner
  $('#winner-display').css('display', 'none');
  createDataBoard(rows, columns);
});
