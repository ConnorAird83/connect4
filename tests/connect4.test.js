/* eslint-disable no-undef */
const each = require('jest-each').default;
const c4 = require('../server/connect4.js');
const mock = require('mock-fs');
const { updateDataFile } = require('../server/connect4.js');
const fs = require('fs').promises;

require('iconv-lite').encodingExists('foo');

const mockData = [{
  board:
  [
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null],
  ],
  target: 4,
  firstPlayer: 'yellow',
  redScore: 0,
  yellowScore: 0,
  id: '69',
}];

afterEach(() => {
  mock.restore();
});

describe('createDataBoard', () => {
  // Arrange
  each([
    [
      20,
      10,
      [
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, null, null],
      ],
    ],
    [
      6,
      7,
      [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
      ],
    ],
  ]).it("When the input is '%s'", (rows, columns, expectedOutput) => {
    // Act
    const actualOutput = c4.createDataBoard(rows, columns);
    // Assert
    expect(expectedOutput).toStrictEqual(actualOutput);
  });
});

describe('placeCounter', () => {
  // Arrange
  each([
    [
      [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
      ],
      0,
      5,
    ],
    [
      [
        ['yellow', null, null, null, null, null, null],
        ['red', null, null, null, null, null, null],
        ['yellow', null, null, null, null, null, null],
        ['red', null, null, null, null, null, null],
        ['yellow', null, null, null, null, null, null],
        ['red', null, null, null, null, null, null],
      ],
      0,
      null,
    ],
    [
      [
        ['yellow', null, null, null, null, null, null],
        ['red', null, null, null, null, null, null],
        ['yellow', null, null, null, null, null, null],
        ['red', null, null, null, null, null, null],
        ['yellow', null, null, null, null, null, null],
        ['red', null, null, null, null, null, null],
      ],
      4,
      5,
    ],
    [
      [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        ['red', 'yellow', 'red', 'yellow', 'red', 'red', 'yellow'],
      ],
      6,
      4,
    ],
  ]).it("When the input is '%s'", (board, column, expectedOutput) => {
    // Act
    const actualOutput = c4.placeCounter(board, column);
    // Assert
    expect(actualOutput).toBe(expectedOutput);
  });
});

describe('checkWinner', () => {
  // Arrange
  each([
    [
      [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
      ],
      5,
      null,
    ],
    [
      [
        ['red', null, null, null, null, null, null],
        ['red', null, null, null, null, null, null],
        ['red', null, null, null, null, null, null],
        ['red', null, null, null, null, null, null],
        ['red', null, null, null, null, null, null],
        ['red', null, null, null, null, null, null],
      ],
      4,
      'red',
    ],
    [
      [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, 'yellow', null, null, null, null, null],
        [null, 'yellow', null, null, null, null, null],
        [null, 'yellow', null, null, null, null, null],
        [null, 'red', 'red', 'red', 'red', null, null],
      ],
      4,
      'red',
    ],
    [
      [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, 'red', null, null, null],
        [null, null, 'red', 'yellow', null, null, null],
        [null, 'red', 'red', 'yellow', null, null, null],
        ['red', 'yellow', 'yellow', 'yellow', 'red', null, null],
      ],
      4,
      'red',
    ],
    [
      [
        ['yellow', 'yellow', 'red', 'red', 'yellow', 'yellow', 'red'],
        ['red', 'red', 'yellow', 'yellow', 'red', 'red', 'yellow'],
        ['yellow', 'yellow', 'red', 'red', 'yellow', 'yellow', 'red'],
        ['red', 'red', 'yellow', 'yellow', 'red', 'red', 'yellow'],
        ['yellow', 'yellow', 'red', 'red', 'yellow', 'yellow', 'red'],
        ['red', 'red', 'yellow', 'yellow', 'red', 'red', 'yellow'],
      ],
      4,
      'nobody',
    ],
    [
      [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        ['yellow', null, null, null, null, null, null],
        ['red', null, 'red', 'red', 'yellow', null, null],
      ],
      4,
      null,
    ],
    [
      [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        ['yellow', null, null, null, null, null, null],
        ['red', 'red', 'red', null, 'yellow', null, null],
      ],
      4,
      null,
    ],
  ]).it("When the input is '%s'", (board, target, expectedOutput) => {
    // Act
    const actualOutput = c4.checkWinner(board, target);
    // Assert
    expect(actualOutput).toBe(expectedOutput);
  });
});

describe('getCurrentPlayer', () => {
  // Arrange
  each([
    [
      [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
      ],
      'red',
      'red',
    ],
    [
      [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, 'red', null, null, null, null, null],
      ],
      'red',
      'yellow',
    ],
    [
      [
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, 'red', 'yellow', null],
      ],
      'yellow',
      'yellow',
    ],
  ]).it("When the input is '%s'", (board, starter, expectedOutput) => {
    // Act
    const actualOutput = c4.getCurrentPlayer(board, starter);
    // Asert
    expect(actualOutput).toBe(expectedOutput);
  });
});

describe('getGames', () => {
  it("When getGames is called and the file doesn't exist, an empty array is returned and the file created", async () => {
    // Arrange
    mock({
      data: {
        'incorrect.js': 'wrong',
      },
    });
    // Act & Assert
    await c4.getGames()
      .then((output) => {
        expect(output).toEqual([]);
        return fs.readFile('data/games.json', 'utf-8')
          .then((data) => expect(JSON.parse(data)).toEqual([]));
      });
  });

  it("When getGames is called and the directory doesn't exist, an empty array is returned and the dir/file created", async () => {
    // Arrange
    mock({
      incorrect: {
        'wrong.js': 'foo bar',
      },
    });

    // Act
    const givenData = await c4.getGames();
    const fileData = await fs.readFile('data/games.json', 'utf-8');

    // Assert
    expect(givenData).toEqual([]);
    expect(JSON.parse(fileData)).toEqual([]);
  });

  it('when getGames is called and everything exists, the contents of the appropriate file is returned', async () => {
    // Arrange
    mock({
      data: {
        'games.json': JSON.stringify(mockData),
      },
    });

    // Act
    const givenData = await c4.getGames();

    // Assert
    expect(givenData).toEqual(mockData);
  });
});

describe('updateDataFile', () => {
  it('when a happy update is proposed the file is updated correctly', async () => {
    mock({
      data: {
        'games.json': JSON.stringify(mockData),
      },
    });
    const storedGames = [{ ...mockData[0] }];
    const newGame = { ...storedGames[0] };

    newGame.redScore = 1;
    c4.updateDataFile(storedGames, newGame);

    const data = await fs.readFile('data/games.json', 'utf-8');

    expect(JSON.parse(data)[0]).toEqual(
      expect.objectContaining({
        redScore: 1,
      }),
    );
  });

  it('When the id of newGame does not match an existing game an error is returned', () => {
    mock({
      data: {
        'games.json': JSON.stringify(mockData),
      }
    })

    const storedGames = mockData.slice();

    const newGame = { ...mockData[0], id: 'ih43ury3489f3' };

    expect(() => updateDataFile(storedGames, newGame)).toThrow(new Error(`No game found with the id ${newGame.id}`))
  });
});

describe('newGameState', () => {
  each([
    [
      [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
      ],
      5,
      467902748927482,
    ],
    [
      [
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, 'red'],
        ['red', null, 'yellow', null, null, 'red', 'yellow'],
      ],
      3,
      837631863162,
    ],
  ]).it('When the input is %s, %s, %s', (board, target, gameId) => {
    // Act
    const expectedOutput = {
      board: board.slice(),
      target: target,
      firstPlayer: 'red',
      redScore: 0,
      yellowScore: 0,
      id: gameId,
    };
    const actualOutput = c4.newGameState(board, target, gameId);
    // Assert
    expect(actualOutput).toEqual(expectedOutput);
  });
});
