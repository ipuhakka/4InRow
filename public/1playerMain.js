// JavaScript source code
function clickedSquare(button) {
    if (locked)
        return;

    if (!player1Turn)
        return;

    var btn = document.getElementById(button);

    var col = findColumn(button);
    var row = findRow(col);

    if (row !== -1) {
        markPress(col, row);
        if (!locked) {
            decide(gameMap);
        }
    }
    else
        console.log("Illegal move!");

}

function switchTurn() {
    if (player1Turn) {
        player1Turn = false;
        document.getElementById('board').innerHTML = "CPU turn";
    }
    else {
        player1Turn = true;
        document.getElementById('board').innerHTML = "P1 turn";
    }
}

function newGame() {
    squares = [];
    gameMap = [];

    var myNode = document.getElementById("gameArea"); //empty div
    while (myNode.firstChild) {
        myNode.removeChild(myNode.firstChild);
    }
    switchTurn();
    locked = false;
    createArea(); //start over

    if (!player1Turn)
        decide(gameMap);
}