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

    it.todo('When valid parameters are provided the expected row is returned');
});