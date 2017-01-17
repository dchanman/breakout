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
 * @returns {jsboard.piece}
 */
Breakout.piece = function (side, height) {
    var name = side + height;
    return jsboard.piece({text: name, fontSize: "35px", textAlign: "center"}).clone();
};

/**
 * Returns the side which owns a piece.
 * Assumes a well-formed piece
 * @param {jsboard.piece} piece
 * @returns {Breakout.SIDE}
 */
Breakout.piece_getSide = function (piece) {
    return piece[0];
};

/**
 * Create a Breakout piece as the given piece with 'increment' extra stacks
 * @param {jsboard.piece} piece
 * @param {Number} increment
 * @returns {jsboard.piece}
 */
Breakout.piece_stack = function (piece, increment) {
    var name = piece[0] + (parseInt(piece.substring(1), 10) + increment);
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
            // this.board.cell([x,y]).removeOn("click", movePiece);
        }
    }
};

/**
 * Creates a list of all legal moves for a piece
 * @param {jsboard.piece} piece
 * @returns {List[[Number, Number]]}
 */
Breakout.prototype.getLegalMoves = function (cell) {
    var piece = this.board.cell(cell).get(),
        side = Breakout.piece_getSide(piece),
        loc = this.board.cell(cell).where(),
        x,
        y,
        legalMoves = [],
        legalMovesHelper;
    /**
     * If x and y is a legal move, add it to legalMoves
     * @returns {Boolean} true to continue searching, false to break
     */
    legalMovesHelper = function (board, x, y) {
        legalMoves.push([y, x]);
        if (board.cell([y, x]).get() !== null) {
            var _piece = board.cell([y, x]).get();
            if (Breakout.piece_getSide(_piece) === side) {
                return false;
            }
        }
        return true;
    };
    // Right
    x = loc[1];
    for (y = loc[0] + 1; y < this.board.rows(); y++) {
        if (!legalMovesHelper(this.board, x, y)) { break; }
    }
    // Left
    for (y = loc[0] - 1; y >= 0; y--) {
        if (!legalMovesHelper(this.board, x, y)) { break; }
    }
    // Down
    y = loc[0];
    for (x = loc[1] + 1; x < this.board.cols(); x++) {
        if (!legalMovesHelper(this.board, x, y)) { break; }
    }
    // Up
    for (x = loc[1] - 1; x >= 0; x--) {
        if (!legalMovesHelper(this.board, x, y)) { break; }
    }
    return legalMoves;
};

Breakout.prototype.onClick = function (cell) {
    this.resetBoard();
    if (this.board.cell(cell).get() !== null) {
        var piece = this.board.cell(cell).get(),
            newPiece = Breakout.piece_stack(piece, 1),
            legalMoves,
            i;
        this.board.cell(cell).place(newPiece);
        legalMoves = this.getLegalMoves(cell);
        for (i = 0; i < legalMoves.length; i++) {
            this.board.cell(legalMoves[i]).DOM().classList.add("legalMove");
        }
    }
};
