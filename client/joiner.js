const baseURL = 'http://localhost:8080';

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

function secondaryGet(newState) {
  // check for a winner
  const newWinner = JSON.parse(newState).winner;

  if (newWinner !== null) {
    $.ajax({
      type: 'POST',
      url: `${baseURL}/swapFirstPlayer`,
    });
    // update each players win count
    if (newWinner !== 'nobody') {
      $('#winner-display').css('color', newWinner);
      const element = $(`#${newWinner}-win-count`);
      const currentValue = Number.parseInt(element.text(), 10);
      element.text(currentValue + 1);
    }
    // display the winner on the screen
    $('#winner-display').fadeIn(200);
    $('#winner-display').fadeOut(1000);
  }
}

function attemptPlace(row, column, player) {
  // if a counter can be placed
  if (row !== null) {
    // update the screen
    updateScreenBoard(row, column, player);

    // get the new state
    $.get({
      url: `${baseURL}/getState`,
      success: (newState) => secondaryGet(newState),
    });
  }
}

function initialGet(currentState, event) {
  const { player } = JSON.parse(currentState);
  const currentWinner = JSON.parse(currentState).winner;

  // if a winner has not been found
  if (currentWinner === null) {
    // gets the id of the lowest child (target) in the mouse click event
    const column = parseInt(event.currentTarget.id.split('-')[3], 10);

    // check if a counter can be placed
    $.ajax({
      type: 'POST',
      url: `${baseURL}/place/${column}/true`,
      success: (row) => attemptPlace(row, column, player),
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

function columnClicked(event) {
  // get the current state
  $.get({
    url: '/getState',
    success: (currentState) => initialGet(currentState, event),
  });
}

function mouseOn(event) {
  // get the current state
  $.get({
    url: `${baseURL}/getState`,
    success: (currentState) => {
      const { player } = JSON.parse(currentState);

      // find the current column
      const column = parseInt(event.currentTarget.id.split('-')[3], 10);

      // find the first row with a free space and update the screen
      $.ajax({
        type: 'POST',
        url: `${baseURL}/place/${column}/false`,
        success: (row) => {
          // change the colour of that circle to pastille version of the colours
          if (row !== null) {
            if (player === 'red') {
              $(`#circle-row-${row}-column-${column}`).css('background-color', 'rgb(255, 0, 10)').css('opacity', 0.8);
            } else {
              $(`#circle-row-${row}-column-${column}`).css('background-color', 'rgb(255, 255, 10)').css('opacity', 0.8);
            }
          }
        },
      });
    },
  });
}

function mouseOff(event) {
  // find the current column
  const column = parseInt(event.currentTarget.id.split('-')[3], 10);
  // find the first row with a free space
  $.ajax({
    type: 'POST',
    url: `${baseURL}/place/${column}/false`,
    success: (row) => {
      // change the colour of that circle back to white
      if (row !== null) {
        $(`#circle-row-${row}-column-${column}`).css('background-color', 'white').css('opacity', 1);
      }
    },
  });
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

function createBoards(rows, columns, target) {
  drawGrid(rows, columns);
  setupListeners();
  // request to create a new board
  $.ajax({
    type: 'PUT',
    url: `${baseURL}/newBoard/${rows}/${columns}/${target}`,
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // create inital boards
  $.ajax({
    type: 'PUT',
    url: `${baseURL}/beginGame`,
  });
  createBoards(6, 7, 4);

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
    const rows = (rowInput === '') ? 6 : rowInput;
    const columns = (columnInput === '') ? 7 : columnInput;
    const target = (targetInput === '') ? 4 : targetInput;
    $('#title').text(`Connect ${target}`);

    // create user defined board
    createBoards(rows, columns, target);
  });
});

// listen for click of reset button
$('#reset-button').click(() => {
  // allow the placing of more counters
  $('#winner-display').css('color', 'black');

  // set all board circle to white
  $.ajax({
    type: 'PUT',
    url: `${baseURL}/reset`,
  });

  $('.circle').css('background-color', 'white').css('opacity', 1);

  // hide the winner banner
  $('#winner-display').css('display', 'none');
});

// TO DO:
//  swap player each game - make check player know who began
//  prevent page refresh wiping the board state
