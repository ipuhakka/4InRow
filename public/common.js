// JavaScript source code for 4 in a row common functions used by both games
function createArea() {
    /*function creates a 6x8 area and registers each square to the game */

    for (var i = 0; i < rows; i++) {
        var sqColumn = [];
        var mapColumn = [];
        //create a new div
        var row = document.createElement('div');
        document.getElementById('gameArea').appendChild(row);

        for (var j = 0; j < columns; j++) {
            //create a new item
            var element = document.createElement("Button");
            element.className = 'square';
            element.id = 'square' + i + '.' + j;
            element.style.backgroundColor = 'gray';

            element.addEventListener('click', function (event) {
                clickedSquare(this.id);
            });

            sqColumn.push(element);
            mapColumn.push(0);
            row.appendChild(element);
        }
        squares.push(sqColumn);
        gameMap.push(mapColumn);
    }
}

function findColumn(id) {
    //function finds a column so we can then place the mark on correct column on the lowest position possible
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < columns; j++) {
            if (id === squares[i][j].id) {
                return j;
            }
        }
    }

}

function findRow(column) {
    //find row 
    for (var i = rows - 1; i >= 0; i--) {
        if (gameMap[i][column] === 0)
            return i;
    }
    //if we haven't returned yet, column is full
    return -1; //full
}

function markPress(col, row) {
    if (player1Turn) {
        gameMap[row][col] = 1;
        squares[row][col].style.backgroundColor = 'black';
    }
    else {
        gameMap[row][col] = 2;
        squares[row][col].style.backgroundColor = 'red';
    }
    checkResult(row, col);
    switchTurn();
}

function updateScore(result) {

    if (result === 1) {
        p1Score = p1Score + 1;
        window.alert("Player 1 won!!");
    }
    else if (result === 2) {
        p2Score = p2Score + 1;

        if (cpu)
            window.alert("CPU won");
        else
            window.alert("Player 2 won!!");
    }

    locked = true;

    if (p1Score < 10)
        document.getElementById('p1Img').src = 'img/' + p1Score + '.png';

    if (p2Score < 10)
        document.getElementById('p2Img').src = 'img/' + p2Score + '.png';
}

function switchTurn() {
    if (player1Turn) {
        player1Turn = false;
        if (cpu)
            document.getElementById('board').innerHTML = "CPU turn";
        else 
            document.getElementById('board').innerHTML = "P2 turn";
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

    if (!player1Turn && cpu)
        decide(gameMap);
}

function clickedSquare(button) {
    if (locked)
        return;

    if (!player1Turn && cpu)
        return;

    var btn = document.getElementById(button);

    var col = findColumn(button);
    var row = findRow(col);

    if (row !== -1) {
        markPress(col, row);
        if (!locked && cpu) {
            decide(gameMap);
        }
    }
    else
        console.log("Illegal move!");
}
