const each = require('jest-each').default;
const { checkWinner, cleanBoard, placeCounter } = require('./connect4');

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

describe ('test checkWinner', () => {
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
      'nobody',
    ],
  ]).it("When the input is '%s'", (board, expectedOutput) => {
    // Act
    const actualOutput = checkWinner(board);
    // Assert
    expect(actualOutput).toBe(expectedOutput);
  });
});

describe ('test cleanBoard', () => {
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
    const actualOutput = cleanBoard(rows, columns);
    // Assert
    expect(expectedOutput).toStrictEqual(actualOutput);
  });
});
