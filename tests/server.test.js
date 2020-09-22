/* eslint-disable no-undef */
const each = require('jest-each').default;
const axios = require('axios').default;
const { get } = require('jquery');
const mock = require('mock-fs');
const request = require('supertest');
const { app, getTheGame } = require('../server/server.js');
const c4 = require('../server/connect4.js');
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
  yellowScore: 1,
  id: '69',
}];

beforeEach(() => {
  mock({
    data: {
      'games.json': JSON.stringify(mockData),
    },
  });
});

afterEach(() => {
  mock.restore();
  jest.restoreAllMocks();
});

describe('getTheGame', () => {
  it('when getTheGame is called with an incorrect id an error is thrown', async () => {
    // Arrange
    const spy = jest.spyOn(c4, 'getGames').mockImplementation(async () => mockData);
    const id = '12345';
    // Act & Assert
    expect(getTheGame(id)).rejects.toEqual(new Error('Game id does not exist!'));
    expect(spy).toHaveBeenCalled();
  });

  it('When getTheGame is called with a correct id the appropriate game is returned', async () => {
    // Arrange
    const spy = jest.spyOn(c4, 'getGames').mockImplementation(async () => mockData);
    const id = '69';
    // Act & Assert
    expect(getTheGame(id)).resolves.toEqual({ ...mockData[0] });
    expect(spy).toHaveBeenCalled();
  });
});

// TO DO
describe('/reset/:id', () => {
  it('when reset request is called the correct board is reset', (done) => {
    const spy = jest.spyOn(c4, 'getGames').mockImplementation(async () => mockData);
    request(app)
      .put('/reset/69')
      .expect('Content-Type', 'text/html; charset=utf-8')
      .expect(200, 'Board has been reset')
      .end(done);
  });
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
