"use strict";

describe('BreakoutBoard test', function () {
    it('should convert a small board to string', function () {
        var board = new BreakoutBoard(1, 2);
        expect(board.toString()).toBe('1,2,[[][]]');
        board = new BreakoutBoard(2, 1);
        expect(board.toString()).toBe('2,1,[[,]]');
    });
});