const express = require('express');
const { finished } = require('stream');
const fs = require('fs').promises;
const {
  checkWinner,
  cleanBoard,
  placeCounter,
  getCurrentPlayer,
  createDataBoard,
} = require('./connect4.js');

const app = express();

// const game = {
//   board: [],
//   target: 4,
//   firstPlayer: 'red',
//   redScore: 0,
//   yellowScore: 0,
// };

app.use(express.static('./client'));

function updateDataFile(storedGames, gameInQuestion, id) {
  // update the appropriate game in storedGames and then write out to the data file
  storedGames.forEach((game) => {
    const index = storedGames.indexOf(game);
    if (game.id === id) {
      storedGames[index] = { ...gameInQuestion };
    }
  });
  fs.writeFile(
    './data/games.json',
    JSON.stringify(storedGames),
    'utf-8',
  );
}

// gets the existing boards from the data file DONE
async function getGames() {
  const fileData = await fs.readFile('./data/games.json', 'utf-8');
  return JSON.parse(fileData);
}

async function getTheGame(id) {
  // get the stored games
  const storedGames = await getGames();
  // get the specific board
  const gameInQuestion = storedGames.filter((game) => game.id === id)[0];
  return gameInQuestion;
}

// DONE
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

// swap the starting player DONE
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

// request to place a counter DONE
app.post('/place/:id/:column/:edit', async (req, res) => {
  const { column, id } = req.params;
  // *** get the state of the game in question ***
  const storedGames = await getGames();
  const gameInQuestion = await getTheGame(id);

  const row = placeCounter(gameInQuestion.board, column);

  let edit = false;
  if (req.params.edit === 'true') {
    edit = true;
  }

  if (row !== null && edit) {
    const player = getCurrentPlayer(gameInQuestion.board, gameInQuestion.firstPlayer);
    gameInQuestion.board[row][column] = player;
    // *** update the stored data ***
    updateDataFile(storedGames, gameInQuestion, id);
  }

  res.send(`${row}`);
});

// request to reset the game DONE
app.put('/reset/:id', async (req, res) => {
  const { id } = req.params;
  // *** get the state of the game in question ***
  const storedGames = await getGames();
  const gameInQuestion = await getTheGame(id);

  gameInQuestion.board = cleanBoard(gameInQuestion.board);

  updateDataFile(storedGames, gameInQuestion, id);

  res.send('data board has been reset');
});

// request to draw a new grid DONE
app.put('/newBoard/:rows/:columns/:target/:id', async (req, res) => {
  let gameObj = {};
  let finalGames = [];
  const { rows } = req.params;
  const { columns } = req.params;
  const { id } = req.params;
  const newTarget = req.params.target;

  const newBoard = createDataBoard(rows, columns);

  // store the pre-existing game data
  const storedGames = await getGames();

  // check if the game already exists
  const gameInQuestion = storedGames.filter((match) => match.id === id);
  // if the game does not exist yet, create a new game object
  if (gameInQuestion.length === 0) {
    gameObj = newGameState(newBoard, newTarget);
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

  // res.send(game.board);
  res.send(newBoard);
});

// get the current player DONE
app.get('/currentPlayer/:id', (req, res) => {
  const { id } = req.params;
  getTheGame(id)
    .then((gameInQuestion) => getCurrentPlayer(gameInQuestion.board, gameInQuestion.firstPlayer))
    .then((player) => res.send([player]))
    .catch((err) => res.send(err));
});

// get the winner DONE
app.get('/winner/:id', async (req, res) => {
  const { id } = req.params;
  const storedGames = await getGames();
  getTheGame(id)
    .then((gameInQuestion) => {
      const winner = checkWinner(gameInQuestion.board, gameInQuestion.target);
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
      updateDataFile(storedGames, gameInQuestion, id);
      res.send([winner]);
    });
});

// request to get the current state of the board DONE
app.get('/getState/:id', (req, res) => {
  const { id } = req.params;
  getTheGame(id)
    .then((gameInQuestion) => {
      const player = getCurrentPlayer(gameInQuestion.board, gameInQuestion.firstPlayer);
      const winner = checkWinner(gameInQuestion.board, gameInQuestion.target);
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

// DONE
app.put('/beginGame/:id', async (req, res) => {
  // TO DO:
  //    use data from file instead of global game state
  const { id } = req.params;
  let rows = 6;
  let columns = 7;
  let newGame = {};

  // get the stored games
  const storedGames = await getGames();

  // check if the game already exists
  const gameInQuestion = storedGames.filter((game) => game.id === id);

  // if the game does not exist yet create one
  if (gameInQuestion.length === 0) {
    const newBoard = createDataBoard(rows, columns);
    newGame = newGameState(newBoard, 4, id);
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

app.listen(8080);
