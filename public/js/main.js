"use strict";

// create board
var b = jsboard.board({
    attach: "game",
    size: "9x5",
    style: "checkerboard"
});

b.cell("each").style({
    width: "75px",
    height: "75px"
});

var breakout = new Breakout(b, 2);

b.cell("each").on("click", function () {
    breakout.onClick(this);
});
