"use strict";

var Move = function (x_from, y_from, x_to, y_to) {
    this.x_from = x_from;
    this.y_from = y_from;
    this.x_to = x_to;
    this.y_to = y_to;
};

var BreakoutBoard = function (cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.board = [];
    var i,
        j;
    for (i = 0; i < cols; i++) {
        this.board.push([]);
        for (j = 0; j < rows; j++) {
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
            board.board[j][i] = row[j] === '' ? null : row[j];
        }
    }
    return board;
};

BreakoutBoard.prototype.toString = function () {
    var string,
        i,
        j;
    string = this.cols + ";" + this.rows + ";";
    for (j = 0; j < this.rows; j++) {
        string += "[";
        for (i = 0; i < this.cols; i++) {
            if (i > 0) {
                string += ",";
            }
            string += this.board[i][j] || "";
        }
        string += "]";
    }
    return string;
};

BreakoutBoard.prototype.getLegalMoves = function (col, row) {
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
        /**
         * This function adds the current tile to the set of legal moves.
         * It then returns 'true' if the tile would not have blocked
         * any additional legal moves, or 'false' otherwise.
         */
        iterativelyAddLegalMoves = function (board, x, y) {
            legalMoves.push(new Move(col, row, x, y));
            if (board[x][y] && board[x][y].side === side) {
                return false;
            }
            return true;
        };
    // Right
    x = col;
    for (y = row + 1; y < this.rows; y++) {
        if (!iterativelyAddLegalMoves(this.board, x, y)) { break; }
    }
    // Left
    for (y = row - 1; y >= 0; y--) {
        if (!iterativelyAddLegalMoves(this.board, x, y)) { break; }
    }
    // Down
    y = row;
    for (x = col + 1; x < this.cols; x++) {
        if (!iterativelyAddLegalMoves(this.board, x, y)) { break; }
    }
    // Up
    for (x = col - 1; x >= 0; x--) {
        if (!iterativelyAddLegalMoves(this.board, x, y)) { break; }
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
