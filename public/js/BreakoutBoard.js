"use strict";

var BreakoutBoard = function (cols, rows) {
    this.cols = cols;
    this.rows = rows;
    this.board = [];
    var i,
        j;
    for (i = 0; i < rows; i++) {
        this.board[i].push([]);
        for (j = 0; j < cols; j++) {
            this.board[i].push(null);
        }
    }
};

BreakoutBoard.prototype.toString = function () {
    var string,
        i,
        j;
    string = this.cols + "," + this.rows;
    string += "[";
    for (i = 0; i < this.rows; i++) {
        string += "[";
        for (j = 0; j < this.cols; j++) {
            if (j > 0) {
                string += ",";
            }
            string += this.board[i][j] === null ? "  " : this.board[i][j];
        }
        string += "]";
    }
    string += "]";
    return string;
};
