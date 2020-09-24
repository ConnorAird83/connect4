/* eslint-disable no-undef */
const each = require('jest-each').default;
const axios = require('axios').default;
const { get } = require('jquery');
const mock = require('mock-fs');
const request = require('supertest');
const { app, getTheGame } = require('../server/server.js');
const c4 = require('../server/connect4.js');
const { getCurrentPlayer } = require('../server/connect4.js');
const fs = require('fs').promises;

require('iconv-lite').encodingExists('foo');

const mockData = () => [{
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
  firstPlayer: 'red',
  redScore: 0,
  yellowScore: 1,
  id: '69',
}];

beforeEach(() => {
  mock({
    data: {
      'games.json': JSON.stringify(mockData()),
    },
  });
});

afterEach(() => {
  mock.restore();
  jest.restoreAllMocks();
});

describe('getTheGame', () => {
  it('when getTheGame is called with an incorrect id an error is thrown', () => {
    // Arrange
    const spy = jest.spyOn(c4, 'getGames').mockImplementation(async () => mockData());
    const id = '12345';
    // Act & Assert
    expect(getTheGame(id)).rejects.toEqual(new Error('Game id does not exist!'));
    expect(spy).toHaveBeenCalled();
  });

  it('When getTheGame is called with a correct id the appropriate game is returned', () => {
    // Arrange
    const spy = jest.spyOn(c4, 'getGames').mockImplementation(async () => mockData());
    const id = '69';
    // Act & Assert
    expect(getTheGame(id)).resolves.toEqual({ ...mockData()[0] });
    expect(spy).toHaveBeenCalled();
  });
});

describe('/reset/:id', () => {
  it('when reset request is called the correct board is reset', (done) => {
    const spy = jest.spyOn(c4, 'getGames').mockImplementation(async () => mockData());
    request(app)
      .put('/reset/69')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200, 'Board has been reset')
      .end(done);
  });

  it('When an incorrect id is given an error message is returned', (done) => {
    const spy = jest.spyOn(c4, 'getGames').mockImplementation(async () => mockData());
    const id = 'ehfu34hr89';
    request(app)
      .put(`/reset/${id}`)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(404, 'Error reseting the board! Refresh the page and input the correct game id')
      .end(done);
  });
});

describe('/place/:id/:column/:edit', () => {
  each([
    [ // Incorrect id
      'djd2u12hdbd23ueh2',
      2,
      false,
      mockData(),
      'Id not found',
    ],
    // Incorrect column
    [
      '69',
      100,
      false,
      mockData(),
      'Invalid column number given',
    ],
    [
      '69',
      'foo bar',
      false,
      mockData(),
      'Column must be an integer',
    ],
    [ // incorrect edit
      '69',
      2,
      'foo bar',
      mockData(),
      'Parameter "edit" must be a boolean value',
    ],
  ]).it('When an invalid parameter is given an error is returned', (id, column, edit, mockedData, message, done) => {
    const spy = jest.spyOn(c4, 'getGames').mockImplementation(async () => mockedData);
    request(app)
      .post(`/place/${id}/${column}/${edit}`)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(400, message)
      .end(done);
  });

  each([
    [
      '69',
      2,
      false,
      5,
      mockData()[0].board,
    ],
    [
      '69',
      2,
      true,
      5,
      [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, 'red', null, null, null, null],
      ],
    ],
  ]).it("When edit is true/false an edit is/isn't made", (id, column, edit, row, endBoard, done) => {
    const spy = jest.spyOn(c4, 'getGames').mockImplementation(async () => mockData());
    request(app)
      .post(`/place/${id}/${column}/${edit}`)
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200, `${row}`)
      .end(async (err, res) => {
        const endData = await fs.readFile('data/games.json', 'utf-8')
          .then((result) => JSON.parse(result));
        expect(endData.filter((game) => game.id === id)[0])
          .toEqual({ ...mockData()[0], board: endBoard });
        done();
      });
  });
});

describe('/newBoard/:rows/:columns/:target/:id', () => { 
  each([
    // Invalid rows
    [
      -9,
      7,
      4,
      "69",
      'Rows must be a positive integer',
    ],
    [
      'foo bar',
      7,
      4,
      "69",
      'Rows must be a positive integer',
    ],
    // Invalid columns
    [
      6,
      -7,
      4,
      "69",
      'Columns must be a positive integer',
    ],
    [
      6,
      'foo bar',
      4,
      "69",
      'Columns must be a positive integer',
    ],
    // Invalid target
    [
      6,
      7,
      -4,
      "69",
      'Target must be a positive integer',
    ],
    [
      6,
      7,
      'foo bar',
      "69",
      'Target must be a positive integer',
    ],
  ]).it('When invalid inputs are provided an error is returned', (rows, columns, target, id, message, done) => {
    request(app)
        .put(`/newBoard/${rows}/${columns}/${target}/${id}`)
        .expect(400, message)
        .end(done);
  });

  // TO DO: change to test for an error instead of a newly created gameState
  it('When a non-existing id is given an error is returned', (done) => {
    // Arrange
    const newId = 'fih3efd3894yf93';
    const message = 'Id does not match any games';

    request(app)
      .put(`/newBoard/8/7/4/${newId}`)
      .expect(400, message)
      .end(done)
  });

  each([
    [
      8,
      7,
      4,
      "69",
      [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
      ],
    ],
    [
      3,
      4,
      2,
      "69",
      [
        [null, null, null, null],
        [null, null, null, null],
        [null, null, null, null],
      ],
    ],
  ]).it('When valid, existing inputs are provided a new board is created', async (rows, columns, newTarget, id, newBoard) => {
    await request(app)
        .put(`/newBoard/${rows}/${columns}/${newTarget}/${id}`)
        .expect(200, newBoard)
        .then(async () => {
          const endData = await fs.readFile('data/games.json', 'utf-8')
            .then((result) => JSON.parse(result));
          expect(endData.length).toBe(1);
          expect(endData.filter((game) => game.id === id)[0])
            .toEqual({ ...mockData()[0], board: newBoard , target: newTarget });
        });
  });
});

describe('/currentPlayer/:id', () => {
  it('When a non-existant id is provided an error is returned', (done) => {
    // Arrange
    const id  = 'eidg2uidh3iu';
    const message = 'Id does not match any games';

    request(app)
        .get(`/currentPlayer/${id}`)
        .expect(400, message)
        .end(done)
  });

  it('When a valid id is provided the correct player is returned', (done) => {
    // Arrange
    const id  = '69';
    const message = '["red"]';

    request(app)
        .get(`/currentPlayer/${id}`)
        .expect(200, message)
        .end(done);
  });
});

describe('/winner/:id', () => {
  it('When a non-existing id was provided an error was returned', (done) => {
     // Arrange
     const id  = 'rhf3u4f023hfiu3h0932h';
     const message = 'Id does not match any games';
 
     request(app)
         .get(`/winner/${id}`)
         .expect(400, message)
         .end(done)
  });

  each([
    [
      '69',
      'red',
      0,
      1,
      mockData(),
      '[null]',
    ],
    [
      '69',
      'yellow',
      1,
      1,
      [
        { ...mockData()[0], board: [
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, 'yellow', null, null, null, null, null],
            [null, 'yellow', null, null, null, null, null],
            [null, 'yellow', null, null, null, null, null],
            [null, 'red', 'red', 'red', 'red', null, null],
          ] 
        }
      ],
      '["red"]',
    ],
    [
      '69',
      'yellow',
      0,
      1,
      [
        { ...mockData()[0], board: [
            ['yellow', 'yellow', 'red', 'red', 'yellow', 'yellow', 'red'],
            ['red', 'red', 'yellow', 'yellow', 'red', 'red', 'yellow'],
            ['yellow', 'yellow', 'red', 'red', 'yellow', 'yellow', 'red'],
            ['red', 'red', 'yellow', 'yellow', 'red', 'red', 'yellow'],
            ['yellow', 'yellow', 'red', 'red', 'yellow', 'yellow', 'red'],
            ['red', 'red', 'yellow', 'yellow', 'red', 'red', 'yellow'],
          ]
        }
      ],
      '["nobody"]',
    ],
  ]).it('When a valid id is provided the correct winner is returned', async (id, newFirstPlayer, newRedScore, newYellowScore, mockedData, expectedWinner) => {
    // Arrange 
    // clear mock and set to required mock
    mock.restore();
    mock({
      data: {
        'games.json': JSON.stringify(mockedData),
      },
    });

    // Act & Assert
    await request(app)
        .get(`/winner/${id}`)
        .expect(200, expectedWinner)
        .then(async () => {
          const endData = await fs.readFile('data/games.json', 'utf-8')
            .then((result) => JSON.parse(result));
          expect(endData.length).toBe(1);
          expect(endData[0])
            .toEqual({ ...mockedData[0],
              firstPlayer: newFirstPlayer, 
              redScore: newRedScore, 
              yellowScore: newYellowScore
            });
        })
  });
});

describe('/getState/:id', () => {
  it('When a non-existing id is provided an error is returned', (done) => {
    // Arrange
    const id  = 'fy89yhf2iu3hfi34jd';
    const message = 'Id does not match any games';

    request(app)
        .get(`/getState/${id}`)
        .expect(400, message)
        .end(done)
  });

  each([
    [
      '["yellow"]',
      '["red"]',
      [
        { ...mockData()[0], board: [
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, 'yellow', null, null, null, null, null],
            [null, 'yellow', null, null, null, null, null],
            [null, 'yellow', null, null, null, null, null],
            [null, 'red', 'red', 'red', 'red', null, null],
          ],
        }
      ],
    ],
    [
      '["yellow"]',
      '[null]',
      mockData(),
    ],
    [
      '["yellow"]',
      '["nobody"]',
      [
        { ...mockData()[0], board: [
            ['yellow', 'yellow', 'red', 'red', 'yellow', 'yellow', 'red'],
            ['red', 'red', 'yellow', 'yellow', 'red', 'red', 'yellow'],
            ['yellow', 'yellow', 'red', 'red', 'yellow', 'yellow', 'red'],
            ['red', 'red', 'yellow', 'yellow', 'red', 'red', 'yellow'],
            ['yellow', 'yellow', 'red', 'red', 'yellow', 'yellow', 'red'],
            ['red', 'red', 'yellow', 'yellow', 'red', 'red', 'yellow'],
          ]
        }
      ],
    ],
  ]).it('When a valid id is provided the correct state is returned', (currentPlayer, expectedWinner, mockedData, done) => {
    // clear mock and set to required mock
    mock.restore();
    mock({
      data: {
        'games.json': JSON.stringify(mockedData),
      },
    });
    // Arrange
    const playerSpy = jest.spyOn(c4, 'getCurrentPlayer').mockImplementation(() => currentPlayer);
    const winnerSpy = jest.spyOn(c4, 'checkWinner').mockImplementation(() => expectedWinner);
    const id  = '69';
    const message = {
      "target": 4,
      "winner": expectedWinner,
      "player": currentPlayer,
      "redScore": 0,
      "yellowScore": 1,
    };

    request(app)
        .get(`/getState/${id}`)
        .expect(200, JSON.stringify(message))
        .expect(() => {
          expect(playerSpy.mock.calls.length).toBe(1);
          expect(winnerSpy.mock.calls.length).toBe(1)
        })
        .end(done);
  });
});

describe('/beginGame/:id', () => {
  it('When a new id is provided a new game is created', async () => {
    // Arrange
    const newId = 'ehdui23y89hd3ui';
    const expectedResponse = { ...mockData()[0], id: newId, yellowScore: 0 };
    // Act
    await request(app)
      .put(`/beginGame/${newId}`)
      .expect(200, expectedResponse)
      .then(async () => {
        const endData = await fs.readFile('data/games.json', 'utf-8')
          .then((result) => JSON.parse(result));
        expect(endData.length).toBe(2);
        expect(endData.filter((game) => game.id === newId)[0])
          .toEqual(expectedResponse);
      })
  });

  it('When an existing id is provided the correct game is returned', async () => {
    // Arrange
    const newId = '69';
    const expectedResponse = { ...mockData()[0] };
    // Act
    await request(app)
      .put(`/beginGame/${newId}`)
      .expect(200, expectedResponse)
      .then(async () => {
        const endData = await fs.readFile('data/games.json', 'utf-8')
          .then((result) => JSON.parse(result));
        expect(endData.length).toBe(1);
        expect(endData.filter((game) => game.id === newId)[0])
          .toEqual(expectedResponse);
      })
  });
});
