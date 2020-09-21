/* eslint-disable no-undef */
const each = require('jest-each').default;
const {
  checkWinner,
  cleanBoard,
  placeCounter,
  getCurrentPlayer,
} = require('../server/connect4.js');

describe('test placeCounter', () => {
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
    const actualOutput = placeCounter(board, column);
    // Assert
    expect(actualOutput).toBe(expectedOutput);
  });
});

describe('test checkWinner', () => {
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
    const actualOutput = checkWinner(board, target);
    // Assert
    expect(actualOutput).toBe(expectedOutput);
  });
});

describe('test cleanBoard', () => {
  // Arrange
  each([
    [
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
        ['yellow', null, null, null, null, null, null, null, null, null],
        ['red', null, 'red', 'yellow', 'red', null, null, null, null, null],
      ],
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
      [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, 'yellow', null, 'red', null, null],
        ['red', null, 'yellow', 'red', 'yellow', null, null],
      ],
      [
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
      ],
    ],
  ]).it("When the input is '%s'", (board, expectedOutput) => {
    // Act
    const actualOutput = cleanBoard(board);
    // Assert
    expect(expectedOutput).toStrictEqual(actualOutput);
  });
});

describe('test getCurrentPlayer', () => {
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
      'yellow',
    ],
    [
      [
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, null, null, null],
        [null, null, 'red', 'yellow', null],
      ],
      'red',
    ],
  ]).it("When the input is '%s'", (board, expectedOutput) => {
    // Act
    const actualOutput = getCurrentPlayer(board);
    // Asert
    expect(actualOutput).toBe(expectedOutput);
  });
});
