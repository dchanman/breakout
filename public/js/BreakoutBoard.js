"use strict";

var Square = function (x, y) {
    this.x = x;
    this.y = y;
};

Square.prototype.equals = function (other) {
    return (other !== null && this.x === other.x && this.y === other.y);
};

var Move = function (x_from, y_from, x_to, y_to) {
    this.x_from = x_from;
    this.y_from = y_from;
    this.x_to = x_to;
    this.y_to = y_to;
};

Move.prototype.equals = function (other) {
    return (this.x_from === other.x_from &&
        this.y_from === other.y_from &&
        this.x_to === other.x_to &&
        this.y_to === other.y_to
    );
};

Move.prototype.isStationary = function () {
    return (this.x_from === this.x_to &&
        this.y_from === this.y_to);
};

Move.prototype.isInMoveList = function (list) {
    var i;
    for (i = 0; i < list.length; i++) {
        if (this.equals(list[i])) {
            return true;
        }
    }
    return false;
};

Move.prototype.toString = function () {
    return "(" + this.x_from + "," + this.y_from + ")-(" +
        this.x_to + "," + this.y_to + ")";
};

Move.prototype.getStep = function () {
    if (this.x_from > this.x_to) {
        return new Square(this.x_from - 1, this.y_from);
    }
    if (this.x_from < this.x_to) {
        return new Square(this.x_from + 1, this.y_from);
    }
    if (this.y_from > this.y_to) {
        return new Square(this.x_from, this.y_from - 1);
    }
    if (this.y_from < this.y_to) {
        return new Square(this.x_from, this.y_from + 1);
    }
    return new Square(this.x_from, this.y_from);
};

Move.prototype.step = function () {
    var step = this.getStep();
    return new Move(step.x, step.y, this.x_to, this.y_to);
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
        y;
    /**
     * This function adds the current tile to the set of legal moves.
     * It then returns 'true' if the tile would not have blocked
     * any additional legal moves, or 'false' otherwise.
     */
    function iterativelyAddLegalMoves(board, x, y) {
        legalMoves.push(new Move(col, row, x, y));
        if (board[x][y] && board[x][y].side === side) {
            return false;
        }
        return true;
    }
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

/**
 * Simultaneously apply move1 and move2
 */
BreakoutBoard.prototype.applyMoves = function (move1, move2) {
    // Check legality of moves
    var legalMoves1, legalMoves2;
    if (move1.x_from === move2.x_from && move1.y_from === move2.y_from) {
        // console.log("Illegal moves: " + move1.toString() + ", " + move2.toString());
        return false;
    }
    legalMoves1 = this.getLegalMoves(move1.x_from, move1.y_from);
    if (!move1.isInMoveList(legalMoves1)) {
        // console.log("Illegal move: " + move1.toString());
        return false;
    }
    legalMoves2 = this.getLegalMoves(move2.x_from, move2.y_from);
    if (!move2.isInMoveList(legalMoves2)) {
        // console.log("Illegal move: " + move2.toString());
        return false;
    }
    function recursiveStep(board, move1, move2) {
        var piece1, piece2, dest1, dest2, stack, move1step, move2step;
        // Terminating Condition 1: Both moves have completed
        if (move1.isStationary() && move2.isStationary()) {
            return;
        }
        // Terminating Condition 2: Two pieces have collided on the previous step
        if (move1.x_from === move2.x_from && move1.y_from === move2.y_from) {
            return;
        }
        piece1 = board.board[move1.x_from][move1.y_from];
        piece2 = board.board[move2.x_from][move2.y_from];
        board.board[move1.x_from][move1.y_from] = null;
        board.board[move2.x_from][move2.y_from] = null;
        move1step = move1.getStep();
        move2step = move2.getStep();
        // Terminating Condition 3: Two adjacent pieces moving into one another:
        // The larger piece will not be moved
        if (move1.x_from === move2step.x && move1.y_from === move2step.y
                && move2.x_from === move1step.x && move2.y_from === move1step.y) {
            stack = Piece.stack(piece1, piece2);
            if (piece1.isLargerThan(piece2)) {
                board.board[move1.x_from][move1.y_from] = stack;
            } else {
                board.board[move2.x_from][move2.y_from] = stack;
            }
            return;
        }
        // Recursive Step: Place pieces onto new squares, recurse
        dest1 = board.board[move1step.x][move1step.y];
        board.board[move1step.x][move1step.y] = Piece.stack(piece1, dest1);
        dest2 = board.board[move2step.x][move2step.y];
        board.board[move2step.x][move2step.y] = Piece.stack(piece2, dest2);
        recursiveStep(board, move1.step(), move2.step());
    }
    recursiveStep(this, move1, move2);
    return true;
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

Piece.prototype.isLargerThan = function (other) {
    return (other !== null && this.stackHeight > other.stackHeight);
};
