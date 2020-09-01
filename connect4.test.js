const { drawGrid, checkWinner, resetGame, placeCounter, updateDisplay } = require('./connect4');
const each = require("jest-each").default;

describe("test placeCounter", () => {
    //Arrange
    each([
        [
            [
                [null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null]
            ],
            0,
            "red",
            true
        ],
        [
            [
                ["red",null,null,null,null,null,null],
                ["red",null,null,null,null,null,null],
                ["red",null,null,null,null,null,null],
                ["red",null,null,null,null,null,null],
                ["red",null,null,null,null,null,null],
                ["red",null,null,null,null,null,null]
            ],
            0,
            "red",
            false
        ]
    ]).it("When the input is '%s'", (board, column, player, expected_output) => {
        //Act
        actual_output = placeCounter(board, column, player)
        //Assert
        expect(actual_output).toStrictEqual(expected_output)
    })
})

describe ("test checkWinner", () => {
    //Arrange
    each([
        [
            [
                [null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null]
            ],
            null
        ]
        [
            [
                ["red",null,null,null,null,null,null],
                ["red",null,null,null,null,null,null],
                ["red",null,null,null,null,null,null],
                ["red",null,null,null,null,null,null],
                ["red",null,null,null,null,null,null],
                ["red",null,null,null,null,null,null]
            ],
            "red"
        ],
        [
            [
                [null,null,null,null,null,null,null],
                [null,null,null,null,null,null,null],
                [null,"yellow",null,null,null,null,null],
                [null,"yellow",null,null,null,null,null],
                [null,"yellow",null,null,null,null,null],
                [null,"red","red","red","red",null,null]
            ],
            "red"
        ]
    ]).it("When the input is '%s'", (board, expected_output) => {
        //Act
        actual_output = checkWinner(board)
        //Assert
        expect(actual_output).toBe(expected_output)
    })
})