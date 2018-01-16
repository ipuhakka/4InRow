// JavaScript source code for 4 in a row AI
var moveOptions = [];

function decide(map) {
    /*function makes the decision of where to place the next mark. It needs the gamemap matrix as a parameter*/
    var positions = availablePositions();
    console.log("available options: " + JSON.stringify(positions));
    //go through all next move positions

    var col = loopPossibilities(positions);
    place(col);
    moveOptions = [];
}

function randomCol(positions) {
    var min, max;
    min = positions[0].x;
    max = positions[0].x;

    for (var i = 0; i < positions.length; i++) { //get min and max values
        if (positions[i].x < min)
            min = positions[i];

        if (positions[i].x > max)
            max = positions[i].x;
            
    }

    //randomise value
    col = Math.floor(Math.random() * (max - min));
    col = col + min;

    return col;
}

function loopPossibilities(positions) {
    //go through possible next moves and decide on one which has the most suggestions
    var col = -1;

    for (var i = 0; i < positions.length; i++) {   //loop the possible moves
        checkSimResult(positions[i].y, positions[i].x);        
    }

    //determine maxWeight
    if (moveOptions.length > 0){
        col = maxWeight();
        console.log("not random");
    }
    else {//if no danger we randomise
        console.log("random");
        col = randomCol(positions);
    }

    return col;
}

function availablePositions() {
    /* function returns a list of available positions to put the next mark*/
    positions = [];

    for (var i = 0; i < columns; i++) {
        var row = findRow(i);

        if (row !== -1 && !exceedsLimitations(i, row)) { //not full
            var position = { x: i, y: row };
            positions.push(position);
        }
    }

    return positions;
}

function place(col) {

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

function checkSimResult(row, col) {
    /* x && y : if -1 then go down, if 0 keep the same and if 1 then go up. Last int is the mark for how many marks needs to be in a row until we do something*/
    console.log("Analyze posit: y: " + row + ' x: ' + col);

    analyzeVector(row, col, 1, -1);
    analyzeVector(row, col, 1, 0);
    analyzeVector(row, col, 1, 1);
    analyzeVector(row, col, 0, 1);

    analyzeVector(row, col, -1, 1);
    analyzeVector(row, col, -1, 0);
    analyzeVector(row, col, -1, -1);
    analyzeVector(row, col, 0, -1);

    console.log("moveOptions lenght: " + moveOptions.length);

}

function maxWeight() {
    //returns the column index of maximum weight column
    var maxColumn = 0;

    for (var i = 0; i < moveOptions.length; i++) {
        if (moveOptions[i].weight > moveOptions[maxColumn].weight)
            maxColumn = i;
    }

    console.log(JSON.stringify(moveOptions));

    return moveOptions[maxColumn].column;
}

function isIllegalMove(x, y) {

    if (exceedsLimitations(x, y))
    {
        return true;
    }
    
    return false;
}

function getVector(row, col, xDir, yDir) {
    var vector = [];
    var xPos = col;
    var yPos = row;

    for (var i = 0; i < 5; i++) {
        var value = 0;
        if (!isIllegalMove(xPos, yPos)) {
            value = gameMap[yPos][xPos];
            if ((value === 0) && (!canBePlayed(xPos, yPos))) {
                value = -1; //open but not possible to play square, so no danger nor opportunity
            }
            vector.push(value);
        }
        xPos = updatePosition(xPos, xDir);
        yPos = updatePosition(yPos, yDir);
    }
    return vector;
}

function canBePlayed(x, y) {
    /*if a cell has 0-value we need to check if it has anything under it (it can be played)*/
    if (exceedsLimitations(x, (y + 1))) //floor, can be played
        return true;
    else
        if (gameMap[(y + 1)][x] !== 0)//can be played
            return true;

    return false;
}

function analyzeVector(row, col, xDir, yDir) {
    /*function returns true if it finds a dangerous vector from the vector.*/
    var vector = getVector(row, col, xDir, yDir);
    var dangerVectors = [];
    dangerVectors.push([0, 1, 1, 0]);
    dangerVectors.push([0, 1, 1, 1]);
    dangerVectors.push([1, 1, 1, 0]);
    dangerVectors.push([0, 2, 2, 0]);
    dangerVectors.push([0, 2, 2, 2]);
    dangerVectors.push([2, 2, 2, 0]);

    console.log(JSON.stringify(vector));
    //check if vector contains any dangerVectors
    for (var i = 0; i < dangerVectors.length; i++) {
        //construct the strings
        var testableStringVector = JSON.stringify(dangerVectors[i]);
        testableStringVector = testableStringVector.substr(1, (testableStringVector.length - 2));

        var index = JSON.stringify(vector).indexOf(testableStringVector);
        if (index !== -1) {
            console.log(index);
            var weight = 0;

            if (index === 3)
                weight = 3;
            else if (index < 3)
                weight = 10;
            else
                weight = 1;


            var move = { column: col, weight: weight };
            appendMove(move);
        }
    }
}

function appendMove(move) {
    /*add to array if doesn't exist, otherwise update weight*/
    console.log("appending");

    for (var i = 0; i < moveOptions.length; i++) {
        if (moveOptions[i].column === move.column) {
            moveOptions[i].weight = moveOptions[i].weight + move.weight;
            return;
        }
    }

    //no match in list
    var row = findRow(move.column);
    if (!exceedsLimitations(move.column, row))
        moveOptions.push(move);
}
