// JavaScript source code containing functions for a four in a row game. 

function clickedSquare(button) {
    if (locked)
        return;

    var btn = document.getElementById(button);

    var col = findColumn(button);
    var row = findRow(col);

    if (row !== -1)
        markPress(col, row);
    else
        console.log("Illegal move!");
 
}

function switchTurn() {
    if (player1Turn) {
        player1Turn = false;
        document.getElementById('board').innerHTML = "P2 turn";
    }
    else {
        player1Turn = true;
        document.getElementById('board').innerHTML = "P1 turn";
    }
}
