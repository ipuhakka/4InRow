// JavaScript source code for AI that simulates the score to find out which position is optimal.
//It works by recursing the desired amount of steps, and everytime a win or loss board is found, it is logged to array with parentNode and current step.
const STEPS = 2;
var array = []; //contains all the win and loss outcomes and the parent node x coordinate

function decide(gameMap) {

    var positions = availablePositions(gameMap);
    for (var i = 0; i < positions.length; i++) {
        var cpyGameMap = copyGameMap(gameMap);
        recursiveSimulation(cpyGameMap, 0, positions[i], positions[i].x);
    }

    console.log("array contains " + array.length + " items");
    array = [];
    var col = randomCol(positions);
    place(col);
}

function recursiveSimulation(cpyGameMap, step, position, parentNode) {
    /* 1.find available positions. simulate placing mark, checkresult, update score and recurs again*/
    var positions = availablePositions(cpyGameMap);

    console.log("Step: " + step);
    checkSimResult(cpyGameMap, position.x, position.y, step, parentNode)
    //return when STEPS <= step
    if (STEPS <= step) {
        //console.log("Result: " + score);
        return;
    }

    step = step + 1;
    for (var i = 0; i < positions.length; i++) {
        cpyGameMap = simPlaceMark(positions[i].x, cpyGameMap, step);
        recursiveSimulation(cpyGameMap, step, positions[i], parentNode);
        cpyGameMap = removeSimMark(positions[i].x, positions[i].y, cpyGameMap);
    }

}

function removeSimMark(x, y, cpyBoard) {

    cpyBoard[y][x] = 0;
    return cpyBoard;
}

function checkSimResult(cpyBoard, x, y, step, parentX) {

    var results = [];

    results.push(checkVector(y, x, 1, -1, cpyBoard));
    results.push(checkVector(y, x, 1, 0, cpyBoard));
    results.push(checkVector(y, x, 1, 1, cpyBoard));
    results.push(checkVector(y, x, 0, 1, cpyBoard));

    if (results.includes(1)) {
       /* console.log("losing");
        printRowByRow(cpyBoard); */
        var loss = { x: parentX, round: step, result: -1 };
        array.push(loss);
        return -1; //losing
    }
    else if (results.includes(2)) {
       /* console.log("Winning");
        printRowByRow(cpyBoard);*/
        var win = { x: parentX, round: step, result: 1 };
        array.push(win);
        return 1; //winning
    }

    return 0; //game still going
}

function simPlaceMark(col, cpyBoard, step) {
    //simulate putting a mark on desired location.

    var row = findPlace(col, cpyBoard);

    if (row !== -1) {
        if (isOdd(step) || step === 0) {
            cpyBoard[row][col] = 2;
        }
        else {
            cpyBoard[row][col] = 1;
        }
    }
    return cpyBoard;
}

function availablePositions(cpyGameMap) {
    /* function returns a list of available positions to put the next mark*/
    positions = [];

    for (var i = 0; i < columns; i++) {
        var row = findPlace(i, cpyGameMap);

        if (row !== -1 && !exceedsLimitations(i, row)) { //not full
            var position = { x: i, y: row };
            positions.push(position);
        }
    }

    return positions;
}

function findPlace(column, cpyGameMap) {
    for (var i = (rows - 1); i >= 0; i--) {
        if (!exceedsLimitations(column, i)) {
            if (cpyGameMap[i][column] === 0)
                return i;
        }
    }
    return -1;
}

function copyGameMap(gameMap) {
    var cpyGameMap = [];

    for (var i = 0; i < rows; i++) {
        var cpyRow = [];

        for (var j = 0; j < columns; j++) {
            cpyRow.push(gameMap[i][j]);
        }
        cpyGameMap.push(cpyRow);
    }

    return cpyGameMap;
}

function randomCol(positions) {
    //select a random place to place the mark

    //randomise value
    col = Math.floor(Math.random() * positions.length);
    return positions[col].x; //index
}

function place(col) {
    //place the actual mark
    if (locked)
        return;

    var row = findRow(col);

    if (row !== -1 && !isIllegalMove(col, row))
        markPress(col, row);
    else {
        console.log("Illegal move! Tried to play " + col + ' ' + row);
        decide();
    }

}

function isIllegalMove(x, y) {

    if (exceedsLimitations(x, y)) {
        return true;
    }

    return false;
}

function printRowByRow(board) {
    console.log("Board: ");
    for (var i = 0; i < rows; i++) {
        console.log(JSON.stringify(board[i]));
    }

}

function isOdd(num) { return (num % 2) == 1; }