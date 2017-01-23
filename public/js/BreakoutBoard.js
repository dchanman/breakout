"use strict";

var BreakoutBoard = function (cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.board = [];
    var i,
        j;
    for (i = 0; i < rows; i++) {
        this.board.push([]);
        for (j = 0; j < cols; j++) {
            this.board[i].push(null);
        }
    }
};

BreakoutBoard.fromString = function (string) {
    var items = string.split(";"),
        cols = parseInt(items[0], 10),
        rows = parseInt(items[1], 10),
        matrixString = items[2],
        regexp = /\[([A-Za-z0-9,]*)\]/gi,
        matrixContents = matrixString.match(regexp),
        board = new BreakoutBoard(cols, rows),
        row,
        i,
        j;
    for (i = 0; i < rows; i++) {
        row = matrixContents[i]
            .substring(1, matrixContents[i].length - 1)
            .split(",");
        for (j = 0; j < cols; j++) {
            board.board[i][j] = row[j] === '' ? null : row[j];
        }
    }
    return board;
};

BreakoutBoard.prototype.toString = function () {
    var string,
        i,
        j;
    string = this.cols + ";" + this.rows + ";";
    for (i = 0; i < this.rows; i++) {
        string += "[";
        for (j = 0; j < this.cols; j++) {
            if (j > 0) {
                string += ",";
            }
            if (this.board[i][j] !== null) {
                string += this.board[i][j];
            }
        }
        string += "]";
    }
    return string;
};

BreakoutBoard.prototype.getLegalMoves = function (col, row) {
    console.log(col, row);
    if (col < 0 || col >= this.cols || row < 0 || row >= this.rows) {
        return [];
    }
    if (this.board[col][row] === null) {
        return [];
    }
    var side = this.board[col][row].side,
        legalMoves = [],
        x,
        y,
        legalMovesHelper = function (board, x, y) {
            legalMoves.push([x, y]);
            if (board[x][y] && board[x][y].side === side) {
                return false;
            }
            return true;
        };
    // Right
    x = col;
    for (y = row + 1; y < this.rows; y++) {
        if (!legalMovesHelper(this.board, x, y)) { break; }
    }
    // Left
    for (y = row - 1; y >= 0; y--) {
        if (!legalMovesHelper(this.board, x, y)) { break; }
    }
    // Down
    y = row;
    for (x = col + 1; x < this.cols; x++) {
        if (!legalMovesHelper(this.board, x, y)) { break; }
    }
    // Up
    for (x = col - 1; x >= 0; x--) {
        if (!legalMovesHelper(this.board, x, y)) { break; }
    }
    return legalMoves;
};

var Piece = function (side, stackHeight) {
    this.side = side;
    this.stackHeight = stackHeight;
};

Piece.stack = function (piece1, piece2) {
    if (piece1 === null) {
        return piece2;
    }
    if (piece2 === null) {
        return piece1;
    }
    if (piece1.side === piece2.side) {
        return new Piece(piece1.side, piece1.stackHeight + piece2.stackHeight);
    }
    if (piece1.stackHeight > piece2.stackHeight) {
        return new Piece(piece1.side, piece1.stackHeight - piece2.stackHeight);
    }
    if (piece2.stackHeight > piece1.stackHeight) {
        return new Piece(piece2.side, piece2.stackHeight - piece1.stackHeight);
    }
    return null;
};

Piece.prototype.toString = function () {
    return this.side + parseInt(this.stackHeight, 10);
};

Piece.fromString = function (string) {
    return new Piece(string[0], parseInt(string.substring(1), 10));
};

Piece.prototype.equals = function (other) {
    return (other !== null &&
            this.side === other.side &&
            this.stackHeight === other.stackHeight);
};
