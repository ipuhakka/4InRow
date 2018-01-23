// JavaScript source code for 4 in a row game Logic
//file contains logic for checking if game has ended

function initStartPositions(cell, dir) {
    //1 = we need to start from the lowest possible point, 0 = it never changes, -1: We need to start from the highest position. Function is used by checkVector in checking
    //results
    if (dir === 1)
        return (cell - 4);
    else if (dir === 0)
        return cell;
    else if (dir === -1)
        return (cell + 4);
}

function checkResult(row, col) {
    /* x && y : if -1 then go down, if 0 keep the same and if 1 then go up*/
    var results = [];

    results.push(checkVector(row, col, 1, -1, gameMap));
    results.push(checkVector(row, col, 1, 0, gameMap));
    results.push(checkVector(row, col, 1, 1, gameMap));
    results.push(checkVector(row, col, 0, 1, gameMap));

    if (results.includes(1))
        updateScore(1);
    else if (results.includes(2))
        updateScore(2);

    //check for draw
    if (boardIsFull()) {
        locked = true;
        window.alert("draw");
    }
}

function boardIsFull() {

    for (var i = 0; i < columns; i++) {

        for (var j = 0; j < rows; j++) {
            if (gameMap[j][i] === 0)
                return false;
        }
    }

    return true;

}

function checkVector(row, col, xDir, yDir, map) {
    //xDir and yDir describe the incline through every step: 0 means no elevation, 1 means up and -1 means down
    var xPos, yPos, nInRow;
    var current = 0;
    nInRow = 0;

    //init starting positions 
    xPos = initStartPositions(col, xDir);
    yPos = initStartPositions(row, yDir);

    //check for exceeding the limitations of the map
    for (var i = 0; i < 9; i++) {
        if (nInRow > 3) {
            if (current === 1) {
                return 1;
            }
            if (current === 2) {
                return 2;
            }
        }

        if (!exceedsLimitations(xPos, yPos)) {
            if (map[yPos][xPos] === current && current !== 0) {
                nInRow++;
            }
            else {
                if (map[yPos][xPos] != 0)
                    nInRow = 1;
                else
                    nInRow = 0;

                current = map[yPos][xPos];
            }
        } else
            nInRow = 0;
        //update position      
        xPos = updatePosition(xPos, xDir);
        yPos = updatePosition(yPos, yDir);
    }
    return 0;
} 
/*
function checkVector(row, col, xDir, yDir, map) {
    //xDir and yDir describe the incline through every step: 0 means no elevation, 1 means up and -1 means down
    var xPos, yPos;
    var vector = [];

    //init starting positions 
    xPos = initStartPositions(col, xDir);
    yPos = initStartPositions(row, yDir);

    //check for exceeding the limitations of the map
    for (var i = 0; i < 9; i++) {

        if (!exceedsLimitations(xPos, yPos))
            vector.push(map[yPos][xPos]);

        //update position      
        xPos = updatePosition(xPos, xDir);
        yPos = updatePosition(yPos, yDir);

        var score = buildVector(vector);

        if (score !== 0)
            return score;
    }

    return 0;
}

function buildVector(vector) {
    var p1Win = JSON.stringify(vector).indexOf("1,1,1,1");
    var p2Win = JSON.stringify(vector).indexOf("2,2,2,2");

    if (p1Win !== -1)
        return 1;
    if (p2Win !== -1)
        return 2;

    return 0;
} */

function updatePosition(pos, dir) {
    //gets us the next point of the vector
    if (dir === 1) {
        return (pos + 1);
    }
    if (dir === 0) {
        return pos;
    }
    if (dir === -1) {
        return (pos - 1);
    }
} 

function exceedsLimitations(xPos, yPos) {
    //check for exceeding the limitations of the map
    if (xPos < 0 || xPos >= columns || yPos < 0 || yPos >= rows)
        return true;
    else
        return false;
}