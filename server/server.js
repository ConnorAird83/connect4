const express = require('express');
const {
  checkWinner,
  cleanBoard,
  placeCounter,
  getCurrentPlayer,
  createDataBoard,
} = require('./connect4.js');

// const drawGrid = require('./joiner.js');

const app = express();

const game = {
  board: [],
  target: 4,
  winner: null,
};

app.use(express.static('./client'));

// request to place a counter
app.post('/place/:column/:edit', (req, res) => {
  const column = req.params.column;
  const row = placeCounter(game.board, column);

  if (row !== null && eval(req.params.edit)) {
    const player = getCurrentPlayer(game.board);
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
  res.send('New board stored');
  game.target = newTarget;
});

// request to get the current state of the board
app.get('/getState', (req, res) => {
  const board = game.board;
  const target = game.target;

  const winner = checkWinner(board, target);
  const player = getCurrentPlayer(board);

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

app.listen(8080);
