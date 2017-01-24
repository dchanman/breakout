"use strict";

Array.prototype.containsSameMoves = function (other) {
    var i,
        j,
        found;
    if (this.length !== other.length) {
        return false;
    }
    for (i = 0; i < this.length; i++) {
        found = false;
        for (j = 0; j < other.length; j++) {
            if (this[i][0] === other[j][0] && this[i][1] === other[j][1]) {
                found = true;
                break;
            }
        }
        if (!found) {
            return false;
        }
    }
    return true;
};

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
        expect(board.board[0][1]).toBe(null);
        board = BreakoutBoard.fromString('1;2;[][b]');
        expect(board.cols).toBe(1);
        expect(board.rows).toBe(2);
        expect(board.board[0][0]).toBe(null);
        expect(board.board[0][1]).toBe("b");
        board = BreakoutBoard.fromString('1;2;[a][b]');
        expect(board.cols).toBe(1);
        expect(board.rows).toBe(2);
        expect(board.board[0][0]).toBe("a");
        expect(board.board[0][1]).toBe("b");
        board = BreakoutBoard.fromString('2;1;[,]');
        expect(board.cols).toBe(2);
        expect(board.rows).toBe(1);
        expect(board.board[0][0]).toBe(null);
        expect(board.board[1][0]).toBe(null);
        board = BreakoutBoard.fromString('2;1;[a,]');
        expect(board.cols).toBe(2);
        expect(board.rows).toBe(1);
        expect(board.board[0][0]).toBe('a');
        expect(board.board[1][0]).toBe(null);
        board = BreakoutBoard.fromString('2;1;[a,b]');
        expect(board.cols).toBe(2);
        expect(board.rows).toBe(1);
        expect(board.board[0][0]).toBe('a');
        expect(board.board[1][0]).toBe('b');
    });
    it('should handle illegal legal move requests', function () {
        var board = new BreakoutBoard(3, 4);
        board.board[1][2] = new Piece("x", 1);
        expect(board.getLegalMoves(0, 0)).toEqual([]);
        expect(board.getLegalMoves(-1, 0)).toEqual([]);
        expect(board.getLegalMoves(0, -1)).toEqual([]);
        expect(board.getLegalMoves(4, 0)).toEqual([]);
        expect(board.getLegalMoves(0, 5)).toEqual([]);
        expect(board.getLegalMoves(1, 1)).toEqual([]);
    });
    it('should get legal moves correctly', function () {
        // _ _ _
        // _ x _
        // _ _ _
        // _ _ _
        var board = new BreakoutBoard(3, 4),
            legalMoves;
        board.board[1][2] = new Piece("x", 1);
        legalMoves = board.getLegalMoves(1, 2);
        expect(legalMoves.containsSameMoves([
            [1, 3],
            [1, 1], [1, 0],
            [2, 2],
            [0, 2]
        ])).toBe(true);
    });
    it('should get legal moves correctly with same team collisions', function () {
        // _ _ _ _ _
        // _ _ x _ _
        // _ x x x _
        // _ _ x _ _
        // _ _ _ _ _
        var board = new BreakoutBoard(5, 5),
            legalMoves;
        board.board[1][2] = new Piece("x", 1);
        board.board[2][1] = new Piece("x", 1);
        board.board[2][2] = new Piece("x", 1);
        board.board[2][3] = new Piece("x", 1);
        board.board[3][2] = new Piece("x", 1);
        legalMoves = board.getLegalMoves(2, 2);
        expect(legalMoves.containsSameMoves([
            [1, 2],
            [2, 1],
            [2, 3],
            [3, 2]
        ])).toBe(true);
    });
    it('should get legal moves correctly with diff team collisions', function () {
        // _ _ _ _ _
        // _ _ o _ _
        // _ o x o _
        // _ _ o _ _
        // _ _ _ _ _
        var board = new BreakoutBoard(5, 5),
            legalMoves;
        board.board[1][2] = new Piece("o", 1);
        board.board[2][1] = new Piece("o", 1);
        board.board[2][2] = new Piece("x", 1);
        board.board[2][3] = new Piece("o", 1);
        board.board[3][2] = new Piece("o", 1);
        legalMoves = board.getLegalMoves(2, 2);
        expect(legalMoves.containsSameMoves([
            [1, 2], [0, 2],
            [2, 1], [2, 0],
            [2, 3], [2, 4],
            [3, 2], [4, 2]
        ])).toBe(true);
    });
});

describe('Piece test', function () {
    it('should create equal pieces', function () {
        var p1 = new Piece("O", 3),
            p2 = new Piece("O", 3);
        expect(p1.equals(p2)).toBe(true);
        expect(p2.equals(p1)).toBe(true);
        expect(p1.equals(p1)).toBe(true);
        expect(p2.equals(p2)).toBe(true);
    });
    it('should create unequal pieces', function () {
        var p1 = new Piece("O", 3),
            p2 = new Piece("O", 2),
            p3 = new Piece("X", 3);
        expect(p1.equals(p2)).toBe(false);
        expect(p2.equals(p1)).toBe(false);
        expect(p2.equals(p3)).toBe(false);
        expect(p3.equals(p2)).toBe(false);
        expect(p3.equals(p1)).toBe(false);
        expect(p1.equals(p3)).toBe(false);
    });
    it('should parse to and from string', function () {
        var p1 = new Piece("O", 3),
            p2 = Piece.fromString("O3");
        expect(p1.equals(p2)).toBe(true);
        expect(p2.equals(p1)).toBe(true);
        expect(p1.equals(p1)).toBe(true);
        expect(p2.equals(p2)).toBe(true);
        expect(p1.toString()).toBe("O3");
        p1 = new Piece("O", 12);
        p2 = Piece.fromString("O12");
        expect(p1.equals(p2)).toBe(true);
        expect(p2.equals(p1)).toBe(true);
        expect(p1.equals(p1)).toBe(true);
        expect(p2.equals(p2)).toBe(true);
        expect(p1.toString()).toBe("O12");
    });
    it('should resolve piece stacking', function () {
        var p1, p2;
        p1 = new Piece("O", 2);
        p2 = new Piece("O", 3);
        expect(Piece.stack(p1, p2).toString()).toBe("O5");
        expect(Piece.stack(p2, p1).toString()).toBe("O5");
        p1 = new Piece("O", 1);
        p2 = new Piece("X", 1);
        expect(Piece.stack(p1, p2)).toBe(null);
        expect(Piece.stack(p2, p1)).toBe(null);
        p1 = new Piece("O", 5);
        p2 = new Piece("X", 3);
        expect(Piece.stack(p1, p2).toString()).toBe("O2");
        expect(Piece.stack(p2, p1).toString()).toBe("O2");
        expect(Piece.stack(null, p1).toString()).toBe(p1.toString());
        expect(Piece.stack(p1, null).toString()).toBe(p1.toString());
        expect(Piece.stack(null, null)).toBe(null);
    });
});