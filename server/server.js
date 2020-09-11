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
  const { rows } = req.params;
  const { columns } = req.params;
  const newTarget = req.params.target;

  // store the new data board
  game.board = createDataBoard(rows, columns);
  res.send('New board stored');
  game.target = newTarget;
});

// request to get the current state of the board
app.get('/getState', (req, res) => {
  const { board } = game;
  const { target } = game;

  const winner = checkWinner(board, target);
  const player = getCurrentPlayer(board, game.firstPlayer);

  if (winner === null) {
    res.send(`{
      "target": ${target},
      "winner": ${winner},
      "player": "${player}"
    }`);
  } else {
    res.send(`{
      "target": ${target},
      "winner": "${winner}",
      "player": "${player}"
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

  if (game.board.length !== 0) {
    rows = game.board.length;
    if (game.board[0].length !== 0) {
      columns = game.board[0].length;
    }
  }
  game.board = createDataBoard(rows, columns);

  res.send(`{
    "rows": ${rows},
    "columns": ${columns},
    "target": ${game.target},
    "redWins": ${game.redScore},
    "yellowWins": ${game.yellowScore},
    "firstPlayer": ${game.firstPlayer},
  }`);
});

app.listen(8080);
