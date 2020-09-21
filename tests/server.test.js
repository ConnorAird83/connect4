/* eslint-disable no-undef */
const each = require('jest-each').default;
const axios = require('axios').default;
const { get } = require('jquery');
const mock = require('mock-fs');
const request = require('supertest');
const { app, getTheGame } = require('../server/server.js');
const c4 = require('../server/connect4.js');

const mockData = {
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
  yellowScore: 1,
  id: '69',
};

afterEach(() => {
  mock.restore();
  jest.restoreAllMocks();
});

describe('getTheGame', () => {
  it('when getTheGame is called with an incorrect id an error is thrown', async () => {
    // Arrange
    const spy = jest.spyOn(c4, 'getGames').mockImplementation(async () => [{ ...mockData }]);
    const id = '12345';
    // Act & Assert
    expect(getTheGame(id)).rejects.toEqual(new Error('Game id does not exist!'));
    expect(spy).toHaveBeenCalled();
  });

  it('When getTheGame is called with a correct id the appropriate game is returned', async () => {
    // Arrange
    const spy = jest.spyOn(c4, 'getGames').mockImplementation(async () => [{ ...mockData }]);
    const id = '69';
    // Act & Assert
    expect(getTheGame(id)).resolves.toEqual({ ...mockData });
    expect(spy).toHaveBeenCalled();
  });
});

// TO DO: Edit so that an error is not returned but the file is created and an empty array returned
describe('getGames', () => {
  it("When getGames is called and the file doesn't exist, an empty array is returned and the file created", async () => {
    // Arrange
    mock({
      data: {},
    });
    // Act & Assert
    c4.getGames()
      .then((output) => {
        expect(output).toEqual([]);
        expect(mock.data['games.json']).toEqual([]);
      });
  });

  it("When getGames is called and the directory doesn't exist, an emty array is returned and the dir/file created", async () => {
    // Arrange
    mock({});

    // Act & Assert
    c4.getGames()
      .then((output) => {
        expect(output).toEqual([]);
        expect(mock.data['games.json']).toEqual([]);
      });
  });

  it.todo('when getGames is called correctly the contents of the appropriate file is returned');
});

// TO DO
describe('/reset/:id', () => {
  it.todo('when reset request is called the correct board is reset');
  // , (done) => {
  //   request(serv.app)
  //     .get('/users')
  //     .expect('Content-Type', /json/)
  //     .expect(200, JSON.stringify(users))
  //     .end(done);
  // });
});

describe('/place/:id/:column/:edit', () => {
  it.todo('test');
});

describe('/newBoard/:rows/:columns/:target/:id', () => {
  it.todo('test');
});

describe('/currentPlayer/:id', () => {
  it.todo('test');
});

describe('/winner/:id', () => {
  it.todo('test');
});

describe('/getState/:id', () => {
  it.todo('test');
});

describe('/beginGame/:id', () => {
  it.todo('test');
});
