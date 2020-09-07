// const { getCurrentPlayer } = require("./connect4");

// Initialise game variables
let board = [
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null],
];
let gameInProgress = true;
let rows = 6;
let columns = 7;
let redWins = 0;
let yellowWins = 0;

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

function updateDataBoard(row, column, player) {
  board[row][column] = player;
}

function updateScreenBoard(row, column, player) {

  $(`#circle-row-${row}-column-${column}`).css('background-color', player).css('opacity', 1);
  if (player === 'red') {
    $(`#circle-row-${row - 1}-column-${column}`).css('background-color', 'yellow').css('opacity', 0.8);
  } else {
    $(`#circle-row-${row - 1}-column-${column}`).css('background-color', 'red').css('opacity', 0.8);
  }
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
  const player = getCurrentPlayer(board);

  // only execute if no one has won yet
  if (gameInProgress) {
    // gets the id of the lowest child (target) in the mouse click event
    const column = parseInt(event.currentTarget.id.split('-')[3], 10);

    // check if a counter can be placed
    const row = placeCounter(board, column);

    // if a counter can be placed
    if (row !== null) {
      // update the screen and data board
      updateScreenBoard(row, column, player);
      updateDataBoard(row, column, player);

      // check for a winner
      const winner = checkWinner(board);
      if (winner !== null) {
        // prevent further coin placing
        gameInProgress = false;

        // stop indicating a players turn
        $(`#${player}-player`).css('color', 'black');

        // display the winner on the screen
        $('#winner-display').css('color', winner);
        $('#winner-display').fadeIn(200);
        $('#winner-display').fadeOut(1000);

        // update the each players win count
        if (winner !== 'nobody') {
          const element = $(`#${winner}-win-count`);
          const currentValue = Number.parseInt(element.text(), 10);
          element.text(currentValue + 1);
        }
      }
    }
  } else {
    console.log('Game is over');
  }
}

function mouseOn(event) {
  const player = getCurrentPlayer(board);
  // find the current column
  const column = parseInt(event.currentTarget.id.split('-')[3], 10);
  // find the first row with a free space
  const row = placeCounter(board, column);

  // change the colour of that circle to pastille version of the colours
  if (row !== null) {
    $(`#circle-row-${row}-column-${column}`).css('background-color', player).css('opacity', 0.8);
  }
}

function mouseOff(event) {
  // find the current column
  const column = parseInt(event.currentTarget.id.split('-')[3], 10);
  // find the first row with a free space
  const row = placeCounter(board, column);

  // change the colour of that circle to pastille version of the colours
  if (row !== null) {
    $(`#circle-row-${row}-column-${column}`).css('background-color', 'white').css('opacity', 1);
  }
}

function setupListeners() {
  // get the child rows of game board as jQuery array
  const rowArray = $('#game-board').children();

  // loop through these rows adding event listeners to each (inc children)
  rowArray.each((row) => {
    const cells = $(`#${rowArray[row].id}`).children();
    cells.each((circles) => {
      $(`#${cells[circles].id}`).click(columnClicked);
      $(`#${cells[circles].id}`).hover(mouseOn, mouseOff);
    });
  });
}

function createBoards(rows, columns) {
  drawGrid(rows, columns);
  createDataBoard(rows, columns);
  setupListeners();
}

document.addEventListener('DOMContentLoaded', () => {
  // create inital boards
  createBoards(6, 7);

  // draw the circles on the window and create the board data structure
  $('#draw-board').click(() => {
    // allow the placing of more counters
    gameInProgress = true;

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
  $('.circle').css('background-color', 'white').css('opacity', 1);

  // hide the winner banner
  $('#winner-display').css('display', 'none');

  // wipe the old and create a new data board
  createDataBoard(rows, columns);
});

// remove for loops in checkWinner {
  // a function to get a column and one to get a row
// }
// remove the need for global variables {
  // Add Linzi style check whos go it is (flatten board and count r's and y's to get totals)
  // Add function to get the board from the html {
    // initially set the screen board not the data board
  // }
// }
// Add colour changing option
