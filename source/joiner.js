/* eslint-disable no-use-before-define */
function drawGrid(numberOfRows, numberOfColumns) {
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

function updateScreenBoard(row, column, player) {
  $(`#circle-row-${row}-column-${column}`).css('background-color', player).css('opacity', 1);
  // move indicative circle up one
  if (player === 'red') {
    $(`#circle-row-${row - 1}-column-${column}`).css('background-color', 'rgb(255, 255, 10)').css('opacity', 0.8);
  } else {
    $(`#circle-row-${row - 1}-column-${column}`).css('background-color', 'rgb(255, 0, 10)').css('opacity', 0.8);
  }
}

function columnClicked(event) {
  const board = getBoard();

  // eslint-disable-next-line no-undef
  const player = getCurrentPlayer(board);

  const winnerDisplay = $('#winner-display');

  // only execute if no one has won yet
  if (winnerDisplay.css('color') === 'rgb(0, 0, 0)') {
    // gets the id of the lowest child (target) in the mouse click event
    const column = parseInt(event.currentTarget.id.split('-')[3], 10);

    // check if a counter can be placed
    // eslint-disable-next-line no-undef
    const row = placeCounter(board, column);

    // if a counter can be placed
    if (row !== null) {
      // update the screen
      updateScreenBoard(row, column, player);
      const newBoard = getBoard();

      // check for a winner
      const target = $('h1').text().substring(8);
      // eslint-disable-next-line no-undef
      const winner = checkWinner(newBoard, target);
      if (winner !== null) {
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
    // eslint-disable-next-line no-console
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

function mouseOn(event) {
  const board = getBoard();

  // eslint-disable-next-line no-undef
  const player = getCurrentPlayer(board);
  // find the current column
  const column = parseInt(event.currentTarget.id.split('-')[3], 10);
  // find the first row with a free space
  // eslint-disable-next-line no-undef
  const row = placeCounter(board, column);

  // change the colour of that circle to pastille version of the colours
  if (row !== null) {
    if (player === 'red') {
      $(`#circle-row-${row}-column-${column}`).css('background-color', 'rgb(255, 0, 10)').css('opacity', 0.8);
    } else {
      $(`#circle-row-${row}-column-${column}`).css('background-color', 'rgb(255, 255, 10)').css('opacity', 0.8);
    }
  }
}

function mouseOff(event) {
  const board = getBoard();

  // find the current column
  const column = parseInt(event.currentTarget.id.split('-')[3], 10);
  // find the first row with a free space
  // eslint-disable-next-line no-undef
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
  setupListeners();
}

function getBoard() {
  const board = [];

  const htmlBoard = $('#game-board').children().slice(1);

  htmlBoard.each((rowIndex) => {
    const row = [];
    const htmlRow = $(`#${htmlBoard[rowIndex].id}`).children();
    htmlRow.each((columnsIndex) => {
      const cellColour = $(`#circle-${htmlRow[columnsIndex].id}`).css('background-color');
      // determine the value which must be inputted into the cell
      if (cellColour === 'rgb(255, 0, 0)') {
        row.push('red');
      } else if (cellColour === 'rgb(255, 255, 0)') {
        row.push('yellow');
      } else {
        row.push(null);
      }
    });
    board.push(row);
  });
  return board;
}

document.addEventListener('DOMContentLoaded', () => {
  // create inital boards
  createBoards(6, 7);

  // draw the circles on the window and create the board data structure
  $('#draw-board').click(() => {
    // allow the placing of more counters
    $('#winner-display').css('color', 'black');

    // delete rows, columns, circles and their listeners
    $('.row').remove();

    // get user input
    const rows = $('#num-rows').val();
    const columns = $('#num-columns').val();
    const target = $('#target-length').val();
    $('#title').text(`Connect ${target}`);

    // create user defined board
    createBoards(rows, columns);
  });
});

// listen for click of reset button
$('#reset-button').click(() => {
  // allow the placing of more counters
  $('#winner-display').css('color', 'black');

  // set all board circle to white
  $('.circle').css('background-color', 'white').css('opacity', 1);

  // hide the winner banner
  $('#winner-display').css('display', 'none');
});
