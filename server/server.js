const express = require('express');
const fs = require('fs').promises;
const c4 = require('./connect4.js');

const app = express();

app.use(express.static('./client'));

const port = 3004;

const getTheGame = async (id) => {
  // get the stored games
  const allGames = await c4.getGames();
  // get the specific board
  const oneGame = allGames.filter((game) => game.id === id);

  if (oneGame.length === 0) {
    throw new Error('Game id does not exist!');
  }

  return oneGame[0];
};

const swapFirstPlayer = async (id) => {
  const storedGames = await c4.getGames();
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
      c4.updateDataFile(storedGames, finishedGame);
    });
};

// request to place a counter
app.post('/place/:id/:column/:edit', async (req, res) => {
  const { column, id } = req.params;

  // check for a valid edit value
  if (req.params.edit !== 'true' && req.params.edit !== 'false') {
    res.status(400).send('Parameter "edit" must be a boolean value');
    return;
  }

  // *** get the state of the game in question ***
  const storedGames = await c4.getGames();

  // console.log(storedGames);

  // Check for valid id
  if (!(storedGames.some((game) => game.id === id))) {
    res.status(400).send('Id not found');
    return;
  }

  const gameInQuestion = await getTheGame(id);

  // check for valid column
  if ((gameInQuestion.board[0].length <= parseInt(column)) || (parseInt(column) < 0)) {
    res.status(400).send('Invalid column number given');
    return;
  } else if (isNaN(parseInt(column))) {
    res.status(400).send('Column must be an integer');
    return;
  }

  const row = c4.placeCounter(gameInQuestion.board, column);

  let edit = false;
  if (req.params.edit === 'true') {
    edit = true;
  }

  if (row !== null && edit) {
    const player = c4.getCurrentPlayer(gameInQuestion.board, gameInQuestion.firstPlayer);
    gameInQuestion.board[row][column] = player;
    // *** update the stored data ***
    c4.updateDataFile(storedGames, gameInQuestion);
  }

  res.send(`${row}`);
});

// request to reset the game
app.put('/reset/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // *** get the state of the game in question ***
    const storedGames = await c4.getGames();
    const gameInQuestion = await getTheGame(id);
    const board = gameInQuestion.board.slice();
    gameInQuestion.board = c4.createDataBoard(board.length, board[0].length);
    c4.updateDataFile(storedGames, gameInQuestion);
    res.status(200).send('Board has been reset');
  } catch (err) {
    res.status(404).send('Error reseting the board! Refresh the page and input the correct game id');
  }
});

// request to draw a new grid
app.put('/newBoard/:rows/:columns/:target/:id', async (req, res) => {
  let gameObj = {};
  let finalGames = [];
  const { rows } = req.params;
  const { columns } = req.params;
  const { id } = req.params;
  const newTarget = req.params.target;
  // Check rows is valid
  if (isNaN(parseInt(rows)) || (parseInt(rows) < 0)) {
    res.status(400).send('Rows must be a positive integer');
    return;
  }
  // Check columns is valid
  if (isNaN(parseInt(columns)) || (parseInt(columns) < 0)) {
    res.status(400).send('Columns must be a positive integer');
    return;
  }
  // Check target is valid
  if (isNaN(parseInt(newTarget)) || (parseInt(newTarget) < 0)) {
    res.status(400).send('Target must be a positive integer');
    return;
  }

  const newBoard = c4.createDataBoard(rows, columns);

  // store the pre-existing game data
  const storedGames = await c4.getGames();

  // check if the game already exists
  const gameInQuestion = storedGames.filter((match) => match.id === id);
  // if the game does not exist yet, create a new game object
  if (gameInQuestion.length === 0) {
    gameObj = c4.newGameState(newBoard, newTarget);
    // append this new object to the stored games
    storedGames.unshift(gameObj);
    finalGames = storedGames;
  } else {
    // delete existing game object from the data file
    finalGames = storedGames.filter((match) => match.id !== id);
    // update the existing game state with the new variables
    gameObj = gameInQuestion[0];
    gameObj.board = newBoard;
    gameObj.target = newTarget;
    // append this new object to the stored games
    finalGames.unshift(gameObj);
  }
  // write the new array back to the data file
  fs.writeFile(
    './data/games.json',
    JSON.stringify(finalGames),
    'utf-8',
  );

  res.send(newBoard);
});

// get the current player
app.get('/currentPlayer/:id', (req, res) => {
  const { id } = req.params;
  getTheGame(id)
    .then((gameInQuestion) => c4.getCurrentPlayer(gameInQuestion.board, gameInQuestion.firstPlayer))
    .then((player) => res.send([player]))
    .catch((err) => res.send(err));
});

// get the winner
app.get('/winner/:id', async (req, res) => {
  const { id } = req.params;
  const storedGames = await c4.getGames();
  getTheGame(id)
    .then((gameInQuestion) => {
      const winner = c4.checkWinner(gameInQuestion.board, gameInQuestion.target);
      return [winner, gameInQuestion];
    })
    .then((output) => {
      const winner = output[0];
      const gameInQuestion = output[1];
      if (winner !== null) {
        swapFirstPlayer(id);
        // update win count
        if (winner === 'red') {
          gameInQuestion.redScore += 1;
        } else if (winner === 'yellow') {
          gameInQuestion.yellowScore += 1;
        }
      }
      c4.updateDataFile(storedGames, gameInQuestion);
      res.send([winner]);
    });
});

// request to get the current state of the board
app.get('/getState/:id', (req, res) => {
  const { id } = req.params;
  getTheGame(id)
    .then((gameInQuestion) => {
      const player = c4.getCurrentPlayer(gameInQuestion.board, gameInQuestion.firstPlayer);
      const winner = c4.checkWinner(gameInQuestion.board, gameInQuestion.target);
      return [player, winner, gameInQuestion];
    })
    .then((output) => {
      const player = output[0];
      const winner = output[1];
      const gameInQuestion = output[2];
      if (winner === null) {
        res.send(`
        {
          "target": ${gameInQuestion.target},
          "winner": ${winner},
          "player": "${player}",
          "redScore": ${gameInQuestion.redScore},
          "yellowScore": ${gameInQuestion.yellowScore}
        }`);
      } else {
        res.send(`
        {
          "target": ${gameInQuestion.target},
          "winner": "${winner}",
          "player": "${player}",
          "redScore": ${gameInQuestion.redScore},
          "yellowScore": ${gameInQuestion.yellowScore}
        }`);
      }
    });
});

app.put('/beginGame/:id', async (req, res) => {
  // TO DO:
  //    use data from file instead of global game state
  const { id } = req.params;
  const rows = 6;
  const columns = 7;
  let newGame = {};

  // get the stored games
  const storedGames = await c4.getGames();

  // check if the game already exists
  const gameInQuestion = storedGames.filter((game) => game.id === id);

  // if the game does not exist yet create one
  if (gameInQuestion.length === 0) {
    const newBoard = c4.createDataBoard(rows, columns);
    newGame = c4.newGameState(newBoard, 4, id);
    storedGames.unshift(newGame);
  } else {
    newGame = gameInQuestion[0];
  }
  // write the new array back to the data file
  fs.writeFile(
    './data/games.json',
    JSON.stringify(storedGames),
    'utf-8',
  );

  res.send(newGame);
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`server started on port ${port}`);
  });
}
// app.listen(8080);

module.exports = {
  getTheGame,
  app,
};

// TO DO: change reset button to use newBoard request instead of reset request
