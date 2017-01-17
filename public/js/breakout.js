"use strict";

// create board
var b = jsboard.board({
    attach: "game",
    size: "8x5",
    style: "checkerboard"
});

b.cell("each").style({
    width: "75px",
    height: "75px"
});

// setup pieces
var SIDE  = {
    X: "X",
    O: "O"
};

var Breakout = function (board) {
    for (var i = 0; i < board.cols(); i++) {
        board.cell([1, i]).place(Breakout.piece(SIDE.X, 1));
        board.cell([2, i]).place(Breakout.piece(SIDE.X, 1));
        board.cell([board.rows() - 2, i]).place(Breakout.piece(SIDE.O, 1));
        board.cell([board.rows() - 3, i]).place(Breakout.piece(SIDE.O, 1));
    }
};

Breakout.piece = function (side, height) {
    var name = side + height;
    return jsboard.piece({text: name, fontSize: "35px", textAlign: "center"}).clone();
};

Breakout.piece_stack = function (piece, increment) {
    var name = piece[0] + (parseInt(piece.substring(1), 10) + increment);
    return jsboard.piece({text: name, fontSize: "35px", textAlign: "center"}).clone();
};

var breakout = Breakout(b);

// alternate turns of x and o
var turn = true;
b.cell("each").on("click", function () {
    if (b.cell(this).get() === null) {
        if (turn) {
            b.cell(this).place(Breakout.piece(SIDE.X, 1));
        } else {
            b.cell(this).place(Breakout.piece(SIDE.O, 1));
        }
        turn = !turn;
    } else {
        console.log(b.cell(this).get());
        var piece = b.cell(this).get(),
            newPiece = Breakout.piece_stack(piece, 1);
        b.cell(this).place(newPiece);
    }
});