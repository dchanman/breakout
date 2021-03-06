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
            new Move(1, 2, 1, 3),
            new Move(1, 2, 1, 1), new Move(1, 2, 1, 0),
            new Move(1, 2, 2, 2),
            new Move(1, 2, 0, 2)
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
            new Move(2, 2, 1, 2),
            new Move(2, 2, 2, 1),
            new Move(2, 2, 2, 3),
            new Move(2, 2, 3, 2)
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
            new Move(2, 2, 1, 2), new Move(2, 2, 0, 2),
            new Move(2, 2, 2, 1), new Move(2, 2, 2, 0),
            new Move(2, 2, 2, 3), new Move(2, 2, 2, 4),
            new Move(2, 2, 3, 2), new Move(2, 2, 4, 2)
        ])).toBe(true);
    });
    it('should not resolve illegal moves', function () {
        // _ _ _ _ _
        // _ _ o _ _
        // _ o x o _
        // _ _ o _ _
        // _ _ _ _ _
        var board = new BreakoutBoard(5, 5);
        board.board[1][2] = new Piece("o", 1);
        board.board[2][1] = new Piece("o", 1);
        board.board[2][2] = new Piece("x", 1);
        board.board[2][3] = new Piece("o", 1);
        board.board[3][2] = new Piece("o", 1);
        // Trying to move nonexistent pieces
        expect(board.applyMoves(new Move(0, 0, 0, 1), new Move(2, 2, 1, 2))).toBe(false);
        expect(board.applyMoves(new Move(2, 2, 1, 2), new Move(0, 0, 0, 1))).toBe(false);
        // Trying to move the same piece
        expect(board.applyMoves(new Move(2, 2, 1, 2), new Move(2, 2, 1, 2))).toBe(false);
        expect(board.applyMoves(new Move(2, 2, 1, 2), new Move(2, 2, 2, 1))).toBe(false);
        // Trying to move illegal moves
        expect(board.applyMoves(new Move(2, 2, 0, 0), new Move(2, 1, 2, 0))).toBe(false);
        expect(board.applyMoves(new Move(2, 1, 2, 0), new Move(2, 2, 0, 0))).toBe(false);
        expect(board.applyMoves(new Move(2, 2, 0, 2), new Move(2, 1, 2, 4))).toBe(false);
        expect(board.applyMoves(new Move(2, 1, 2, 4), new Move(2, 2, 0, 2))).toBe(false);
    });
    it('should resolve collisions between adjacent pieces', function () {
        var board;
        board = new BreakoutBoard(2, 2);
        // o1 _
        // x1 _
        board.board[0][0] = new Piece("o", 1);
        board.board[0][1] = new Piece("x", 1);
        expect(board.applyMoves(new Move(0, 0, 0, 1), new Move(0, 1, 0, 0))).toBe(true);
        expect(board.board[0][0]).toBe(null);
        expect(board.board[0][1]).toBe(null);
        // o1 _
        // x2 _
        board = new BreakoutBoard(2, 2);
        board.board[0][0] = new Piece("o", 1);
        board.board[0][1] = new Piece("x", 2);
        expect(board.applyMoves(new Move(0, 0, 0, 1), new Move(0, 1, 0, 0))).toBe(true);
        expect(board.board[0][0]).toBe(null);
        expect(board.board[0][1].toString()).toBe("x1");
        // o2 _
        // x1 _
        board = new BreakoutBoard(2, 2);
        board.board[0][0] = new Piece("o", 2);
        board.board[0][1] = new Piece("x", 1);
        expect(board.applyMoves(new Move(0, 0, 0, 1), new Move(0, 1, 0, 0))).toBe(true);
        expect(board.board[0][0].toString()).toBe("o1");
        expect(board.board[0][1]).toBe(null);
        // o1 x1
        // _  _
        board.board[0][0] = new Piece("o", 1);
        board.board[1][0] = new Piece("x", 1);
        expect(board.applyMoves(new Move(0, 0, 1, 0), new Move(1, 0, 0, 0))).toBe(true);
        expect(board.board[0][0]).toBe(null);
        expect(board.board[1][0]).toBe(null);
        // o1 x2
        // _  _
        board = new BreakoutBoard(2, 2);
        board.board[0][0] = new Piece("o", 1);
        board.board[1][0] = new Piece("x", 2);
        expect(board.applyMoves(new Move(0, 0, 1, 0), new Move(1, 0, 0, 0))).toBe(true);
        expect(board.board[0][0]).toBe(null);
        expect(board.board[1][0].toString()).toBe("x1");
        // o2 x1
        // _  _
        board = new BreakoutBoard(2, 2);
        board.board[0][0] = new Piece("o", 2);
        board.board[1][0] = new Piece("x", 1);
        expect(board.applyMoves(new Move(0, 0, 1, 0), new Move(1, 0, 0, 0))).toBe(true);
        expect(board.board[0][0].toString()).toBe("o1");
        expect(board.board[1][0]).toBe(null);
    });
    it('should resolve collisions to the same space (single step)', function () {
        var board;
        // o1 _ x1
        board = new BreakoutBoard(1, 3);
        board.board[0][0] = new Piece("o", 1);
        board.board[0][2] = new Piece("x", 1);
        expect(board.applyMoves(new Move(0, 0, 0, 2), new Move(0, 2, 0, 0))).toBe(true);
        expect(board.board[0][0]).toBe(null);
        expect(board.board[0][1]).toBe(null);
        expect(board.board[0][2]).toBe(null);
        // o2 _ x1
        board = new BreakoutBoard(1, 3);
        board.board[0][0] = new Piece("o", 2);
        board.board[0][2] = new Piece("x", 1);
        expect(board.applyMoves(new Move(0, 0, 0, 2), new Move(0, 2, 0, 0))).toBe(true);
        expect(board.board[0][0]).toBe(null);
        expect(board.board[0][1].toString()).toBe("o1");
        expect(board.board[0][2]).toBe(null);
        // o1 _ x2
        board = new BreakoutBoard(1, 3);
        board.board[0][0] = new Piece("o", 1);
        board.board[0][2] = new Piece("x", 2);
        expect(board.applyMoves(new Move(0, 0, 0, 2), new Move(0, 2, 0, 0))).toBe(true);
        expect(board.board[0][0]).toBe(null);
        expect(board.board[0][1].toString()).toBe("x1");
        expect(board.board[0][2]).toBe(null);
        // o1
        // _
        // x1
        board = new BreakoutBoard(3, 1);
        board.board[0][0] = new Piece("o", 1);
        board.board[2][0] = new Piece("x", 1);
        expect(board.applyMoves(new Move(2, 0, 0, 0), new Move(0, 0, 2, 0))).toBe(true);
        expect(board.board[0][0]).toBe(null);
        expect(board.board[1][0]).toBe(null);
        expect(board.board[2][0]).toBe(null);
        // o2 _ x1
        board = new BreakoutBoard(3, 1);
        board.board[0][0] = new Piece("o", 2);
        board.board[2][0] = new Piece("x", 1);
        expect(board.applyMoves(new Move(2, 0, 0, 0), new Move(0, 0, 2, 0))).toBe(true);
        expect(board.board[0][0]).toBe(null);
        expect(board.board[1][0].toString()).toBe("o1");
        expect(board.board[2][0]).toBe(null);
        // o1 _ x2
        board = new BreakoutBoard(3, 1);
        board.board[0][0] = new Piece("o", 1);
        board.board[2][0] = new Piece("x", 2);
        expect(board.applyMoves(new Move(2, 0, 0, 0), new Move(0, 0, 2, 0))).toBe(true);
        expect(board.board[0][0]).toBe(null);
        expect(board.board[1][0].toString()).toBe("x1");
        expect(board.board[2][0]).toBe(null);
    });
    it('should resolve collisions to the same space (multi step)', function () {
        var board;
        // o1 _ _ _ x1
        board = new BreakoutBoard(1, 5);
        board.board[0][0] = new Piece("o", 1);
        board.board[0][4] = new Piece("x", 1);
        expect(board.applyMoves(new Move(0, 0, 0, 4), new Move(0, 4, 0, 0))).toBe(true);
        expect(board.board[0][0]).toBe(null);
        expect(board.board[0][1]).toBe(null);
        expect(board.board[0][2]).toBe(null);
        expect(board.board[0][3]).toBe(null);
        expect(board.board[0][4]).toBe(null);
        // o2 _ _ _ x1
        board = new BreakoutBoard(1, 5);
        board.board[0][0] = new Piece("o", 2);
        board.board[0][4] = new Piece("x", 1);
        expect(board.applyMoves(new Move(0, 0, 0, 4), new Move(0, 4, 0, 0))).toBe(true);
        expect(board.board[0][0]).toBe(null);
        expect(board.board[0][1]).toBe(null);
        expect(board.board[0][2].toString()).toBe("o1");
        expect(board.board[0][3]).toBe(null);
        expect(board.board[0][4]).toBe(null);
        // o1 _ _ _ x2
        board = new BreakoutBoard(1, 5);
        board.board[0][0] = new Piece("o", 1);
        board.board[0][4] = new Piece("x", 2);
        expect(board.applyMoves(new Move(0, 0, 0, 4), new Move(0, 4, 0, 0))).toBe(true);
        expect(board.board[0][0]).toBe(null);
        expect(board.board[0][1]).toBe(null);
        expect(board.board[0][2].toString()).toBe("x1");
        expect(board.board[0][3]).toBe(null);
        expect(board.board[0][4]).toBe(null);
    });
    it('should resolve independent moves', function () {
        var board;
        // o1 _ _ _ x1
        board = new BreakoutBoard(1, 5);
        board.board[0][0] = new Piece("o", 1);
        board.board[0][4] = new Piece("x", 1);
        expect(board.applyMoves(new Move(0, 0, 0, 1), new Move(0, 4, 0, 3))).toBe(true);
        expect(board.board[0][0]).toBe(null);
        expect(board.board[0][1].toString()).toBe("o1");
        expect(board.board[0][2]).toBe(null);
        expect(board.board[0][3].toString()).toBe("x1");
        expect(board.board[0][4]).toBe(null);
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

describe('Move test', function () {
    it('should step properly', function () {
        var move;
        move = new Move(0, 0, 2, 0);
        expect(move.step().equals(new Move(1, 0, 2, 0)));
        expect(move.step().step().equals(new Move(2, 0, 2, 0)));
        expect(move.step().step().step().equals(new Move(2, 0, 2, 0)));
        move = new Move(0, 0, 0, 2);
        expect(move.step().equals(new Move(0, 1, 0, 2)));
        expect(move.step().step().equals(new Move(0, 2, 0, 2)));
        expect(move.step().step().step().equals(new Move(0, 2, 0, 2)));
        move = new Move(2, 0, 0, 0);
        expect(move.step().equals(new Move(1, 0, 0, 0)));
        expect(move.step().step().equals(new Move(0, 0, 0, 0)));
        expect(move.step().step().step().equals(new Move(0, 0, 0, 0)));
        move = new Move(0, 2, 0, 0);
        expect(move.step().equals(new Move(0, 1, 0, 0)));
        expect(move.step().step().equals(new Move(0, 0, 0, 0)));
        expect(move.step().step().step().equals(new Move(0, 0, 0, 0)));
    });
});