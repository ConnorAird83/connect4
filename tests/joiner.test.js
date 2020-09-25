/* eslint-disable no-undef */
const each = require('jest-each').default;
const axios = require('axios').default;
const mock = require('mock-fs');
const Item = require('mock-fs/lib/item');
const request = require('supertest');
const fs = require('fs').promises;
const jr = require('../client/joiner.js');

describe('getRow', () => {
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
            'foo bar',
            'Column must be a positive integer',
        ],
        [
            [
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
            ],
            -6,
            'Column must be a positive integer',
        ],
        [
            'foo bar',
            4,
            'Board must be a 2D array',
        ],
        [
            420,
            4,
            'Board must be a 2D array',
        ]
    ]).it('When invalid parameters are provided an error is returned', async (board, column, expectedMessage) => {
        // Act & Assert
        expect(() => jr.getRow(board, column)).rejects.toThrow(new Error(expectedMessage));
    });

    it('When an out of range column is provided an error is returned', () => {
        // Arrange
        const column = 10;
        const board = [
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null],
        ];
        // Act
        expect(() => jr.getRow(board, column)).rejects.toThrow(new Error('Column out of range'));
    });

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
            3,
            5, 
        ],
        [
            [
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
                [null, null, null, null, null, null],
            ],
            0,
            4, 
        ],
        [
            [
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
            ],
            6,
            8, 
        ],
    ]).it('When valid parameters are provided the expected row is returned', async (board, column, expectedRow) => {
        // Act & Assert
        await jr.getRow(board, column)
            .then((actualRow) => expect(actualRow).toBe(expectedRow));
    });
});

describe('getCurrentPlayer', () => {
    each([
        // firstPlayer
        [
            [
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
            ],
            'foo bar',
            'starter must be a string containing either red or yellow',
        ],
        [
            [
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
            ],
            [644892647],
            'starter must be a string containing either red or yellow',
        ],
        [
            [
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
            ],
            { firstPlayer: 'ehfej' },
            'starter must be a string containing either red or yellow',
        ],
        [
            [
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
            ],
            644892647,
            'starter must be a string containing either red or yellow',
        ],
        [
            [
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
            ],
            false,
            'starter must be a string containing either red or yellow',
        ],
        // board
        [
            'foo bar',
            'red',
            'board must be a 2D array',
        ],
        [
            7489236478923,
            'yellow',
            'board must be a 2D array',
        ],
        [
            {board: [48983, 987489]},
            'red',
            'board must be a 2D array',
        ],
        [
            true,
            'red',
            'board must be a 2D array',
        ],
    ]).it('When invalid parameters are given an error is returned', (board, firstPlayer, expectedMessage) => {
        // Act & Assert
        expect(() => jr.getCurrentPlayer(board, firstPlayer)).toThrow(new Error(expectedMessage));
    });

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
                [null, null, 'yellow', null, null, null, null],
            ],
            'yellow',
            'red',
        ],
        [
            [
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, null, null, null, null, null],
                [null, null, 'yellow', null, null, null, null],
                [null, null, 'red', null, null, null, null],
                [null, 'red', 'yellow', 'red', null, null, null],
            ],
            'red',
            'yellow',
        ],
    ]).it('When valid inputs are given the correct player is returned', (board, firstPlayer, expectedPlayer) => {
        // Act
        const actualPlayer = jr.getCurrentPlayer(board, firstPlayer);
        // Assert
        expect(actualPlayer).toBe(expectedPlayer);
    })
})
