"use strict";

/**
 * Breakout object, representing a Breakout game.
 * Initializes the board with each player having 'numRows' rows of pieces each
 * Assumes that the board is large enough to fit the requested pieces
 * @param {jsboard} board
 * @param {Number} numRows
 */
var Breakout = function (board, numRows) {
    var y, x;
    this.board = board;
    this.breakoutBoard = new BreakoutBoard(board.cols(), board.rows());
    this.turn = true;
    // Set up board
    for (y = 0; y < numRows; y++) {
        for (x = 0; x < this.breakoutBoard.cols; x++) {
            this.breakoutBoard.board[x][1 + y] = new Piece("X", 1);
            this.breakoutBoard.board[x][this.breakoutBoard.rows - 2 - y] = new Piece("O", 1);
        }
    }
    this.renderBoard();
};

Breakout.SIDE = {
    X: "X",
    O: "O"
};

/**
 * Create a Breakout piece for a given side, with a given stack height
 * @param {Breakout.SIDE} side
 * @param {Number} height
 * @returns {jsboard.piece}
 */
Breakout.piece = function (side, height) {
    var name = side + height;
    return jsboard.piece({text: name, fontSize: "35px", textAlign: "center"}).clone();
};

/**
 * Removes all extra classes and listeners from the board
 */
Breakout.prototype.resetBoard = function () {
    var x, y;
    for (y = 0; y < this.board.rows(); y++) {
        for (x = 0; x < this.board.cols(); x++) {
            this.board.cell([y, x]).DOM().classList.remove("legalMove");
        }
    }
};

Breakout.prototype.renderBoard = function () {
    var x, y;
    for (x = 0; x < this.breakoutBoard.cols; x++) {
        for (y = 0; y < this.breakoutBoard.rows; y++) {
            if (this.breakoutBoard.board[x][y]) {
                this.board.cell([y, x]).place(
                    Breakout.piece(
                        this.breakoutBoard.board[x][y].side,
                        parseInt(this.breakoutBoard.board[x][y].stackHeight, 10)
                    )
                );
            } else {
                this.board.cell([y, x]).rid();
            }
        }
    }
};

Breakout.prototype.onClick = function (cell) {
    var legalMoves, i,
        coord = this.board.cell(cell),
        x = coord.where()[1],
        y = coord.where()[0];
    this.resetBoard();
    if (coord.get() !== null) {
        legalMoves = this.breakoutBoard.getLegalMoves(x, y);
        for (i = 0; i < legalMoves.length; i++) {
            this.board.cell([legalMoves[i][1], legalMoves[i][0]]).DOM().classList.add("legalMove");
        }
    }
};
