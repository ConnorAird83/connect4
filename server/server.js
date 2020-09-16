const express = require('express');
const {
  checkWinner,
  cleanBoard,
  placeCounter,
  getCurrentPlayer,
  createDataBoard,
} = require('./connect4.js');

const app = express();

const game = {
  board: [],
  target: 4,
  firstPlayer: 'red',
  redScore: 0,
  yellowScore: 0,
};

app.use(express.static('./client'));

// request to place a counter
app.post('/place/:column/:edit', (req, res) => {
  const { column } = req.params;
  const row = placeCounter(game.board, column);
  let edit = false;

  if (req.params.edit === 'true') {
    edit = true;
  }

  if (row !== null && edit) {
    const player = getCurrentPlayer(game.board, game.firstPlayer);
    game.board[row][column] = player;
  }
  res.send(`${row}`);
});

// request to reset the game
app.put('/reset', (req, res) => {
  game.board = cleanBoard(game.board);

  res.send('data board has been reset');
});

// request to draw a new grid
app.put('/newBoard/:rows/:columns/:target', (req, res) => {
  const rows = req.params.rows;
  const columns = req.params.columns;
  const newTarget = req.params.target;

  // store the new data board
  game.board = createDataBoard(rows, columns);
  game.target = newTarget;
  res.send(game.board);
});

// get the current player
app.get('/currentPlayer', (req, res) => {
  const player = getCurrentPlayer(game.board, game.firstPlayer);
  res.send([player]);
});

// swap the starting player
function swapFirstPlayer() {
  if (game.firstPlayer === 'red') {
    game.firstPlayer = 'yellow';
  } else {
    game.firstPlayer = 'red';
  }
}

// get the winner
app.get('/winner', (req, res) => {
  const winner = checkWinner(game.board, game.target);
  if (winner !== null) {
    swapFirstPlayer();
    // update win count
    if (winner === 'red') {
      game.redScore += 1;
    } else if (winner === 'yellow') {
      game.yellowScore += 1;
    }
  }
  res.send([winner]);
});

// request to get the current state of the board
app.get('/getState', (req, res) => {
  const player = getCurrentPlayer(game.board, game.firstPlayer);
  const winner = checkWinner(game.board, game.target);

  if (winner === null) {
    res.send(`
    {
      "target": ${game.target},
      "winner": ${winner},
      "player": "${player}",
      "redScore": ${game.redScore},
      "yellowScore": ${game.yellowScore}
    }`);
  } else {
    res.send(`
    {
      "target": ${game.target},
      "winner": "${winner}",
      "player": "${player}",
      "redScore": ${game.redScore},
      "yellowScore": ${game.yellowScore}
    }`);
  }
});

app.post('/swapFirstPlayer', (req, res) => {
  if (game.firstPlayer === 'red') {
    game.firstPlayer = 'yellow';
  } else {
    game.firstPlayer = 'red';
  }
  res.send('nice job');
});

app.put('/beginGame', (rep, res) => {
  let rows = 6;
  let columns = 7;

  if (game.board.length > 0) {
    rows = game.board.length;
    columns = game.board[0].length;
  } else {
    game.board = createDataBoard(rows, columns);
  }

  res.send(game);
});

app.listen(8080);
