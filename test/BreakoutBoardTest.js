"use strict";

describe('BreakoutBoard test', function () {
    it('should convert a small board to string', function () {
        var board = new BreakoutBoard(1, 2);
        expect(board.toString()).toBe('1;2;[][]');
        board = new BreakoutBoard(2, 1);
        expect(board.toString()).toBe('2;1;[,]');
    });
    it('should convert a string to a small board', function () {
        var board = BreakoutBoard.fromString('1;2;[][]');
        expect(board.cols).toBe(1);
        expect(board.rows).toBe(2);
        expect(board.board[0][0]).toBe(null);
        expect(board.board[1][0]).toBe(null);
        board = BreakoutBoard.fromString('1;2;[][b]');
        expect(board.cols).toBe(1);
        expect(board.rows).toBe(2);
        expect(board.board[0][0]).toBe(null);
        expect(board.board[1][0]).toBe("b");
        board = BreakoutBoard.fromString('1;2;[a][b]');
        expect(board.cols).toBe(1);
        expect(board.rows).toBe(2);
        expect(board.board[0][0]).toBe("a");
        expect(board.board[1][0]).toBe("b");
        board = BreakoutBoard.fromString('2;1;[,]');
        expect(board.cols).toBe(2);
        expect(board.rows).toBe(1);
        expect(board.board[0][0]).toBe(null);
        expect(board.board[0][1]).toBe(null);
        board = BreakoutBoard.fromString('2;1;[a,]');
        expect(board.cols).toBe(2);
        expect(board.rows).toBe(1);
        expect(board.board[0][0]).toBe('a');
        expect(board.board[0][1]).toBe(null);
        board = BreakoutBoard.fromString('2;1;[a,b]');
        expect(board.cols).toBe(2);
        expect(board.rows).toBe(1);
        expect(board.board[0][0]).toBe('a');
        expect(board.board[0][1]).toBe('b');
    });
});
