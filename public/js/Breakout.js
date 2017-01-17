"use strict";

/**
 * Breakout object, representing a Breakout game.
 * Initializes the board with each player having 'numRows' rows of pieces each
 * Assumes that the board is large enough to fit the requested pieces
 * @param {jsboard} board
 * @param {Number} numRows
 */
var Breakout = function (board, numRows) {
    var i, j;
    this.board = board;
    this.turn = true;
    // Set up board
    for (i = 0; i < board.cols(); i++) {
        for (j = 0; j < numRows; j++) {
            board.cell([1 + j, i]).place(Breakout.piece(Breakout.SIDE.X, 1));
            board.cell([board.rows() - 2 - j, i]).place(Breakout.piece(Breakout.SIDE.O, 1));
        }
    }
};

Breakout.SIDE = {
    X: "X",
    O: "O"
};

/**
 * Create a Breakout piece for a given side, with a given stack height
 * @param {Breakout.SIDE} side
 * @param {Number} height
 */
Breakout.piece = function (side, height) {
    var name = side + height;
    return jsboard.piece({text: name, fontSize: "35px", textAlign: "center"}).clone();
};

/**
 * Create a Breakout piece as the given piece with 'increment' extra stacks
 * @param {Breakout.piece} piece
 * @param {Number} increment
 */
Breakout.piece_stack = function (piece, increment) {
    var name = piece[0] + (parseInt(piece.substring(1), 10) + increment);
    return jsboard.piece({text: name, fontSize: "35px", textAlign: "center"}).clone();
};

Breakout.prototype.onClick = function (cell) {
    if (this.board.cell(cell).get() !== null) {
        var piece = this.board.cell(cell).get(),
            newPiece = Breakout.piece_stack(piece, 1);
        this.board.cell(cell).place(newPiece);
    }
};
