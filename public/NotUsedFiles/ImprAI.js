// JavaScript source code for AI that simulates the score to find out which position is optimal.
//It works by recursing the desired amount of steps, and everytime a win or loss board is found, it is logged to array with parentNode and current step.
/*xArray = {parent, wins, losses, step}*/
/*array = {x, round, result}*/
const STEPS = 4;
var array = []; //contains all the win and loss outcomes and the parent node x coordinate

function decide(gameMap) {

    var col = -1;
    var t0 = performance.now();
    var positions = availablePositions(gameMap);
    for (var i = 0; i < positions.length; i++) {
        var cpyGameMap = copyGameMap(gameMap);
        recursiveSimulation(cpyGameMap, 0, positions[i], positions[i].x);
        removeSimMark(positions[i].x, cpyGameMap);
    }
    var t1 = performance.now();
    console.log("took " + (t1 - t0) + " milliseconds.");
    console.log("array contains " + array.length + " items");

    if (array.length > 0) {
        col = decideCol(positions);
    } if (col === -1) {
        console.log("random");
        col = randomCol(positions);
    } else
        console.log("not random");

    place(col);
    array = [];
}

function recursiveSimulation(cpyGameMap, step, position, parentNode) {
    /* 1.find available positions. simulate placing mark, checkresult, and when all paths from that node have been analyzed (or game has ended) delete it. */
    var positions = availablePositions(cpyGameMap);

    cpyGameMap = simPlaceMark(position.x, cpyGameMap, step); 
    var res = checkSimResult(cpyGameMap, position.x, position.y, step, parentNode);
    //return when STEPS <= step
    if (step === (STEPS - 1) || res !== 0) {
        return;
    }

    step = step + 1;
    for (var i = 0; i < positions.length; i++) {
        recursiveSimulation(cpyGameMap, step, positions[i], parentNode);
        cpyGameMap = removeSimMark(positions[i].x, cpyGameMap);
    }

    return;
}

function decideCol(positions) {
    //create array with wins/losses of a parentnode and step the play ended. 
    var xArray = []; //amount of win / lose situations with the selection
    for (var i = 0; i < array.length; i++) {

        if (array[i].round === 0) //if we play we win
        {
            console.log("emergency:" + array[i].x);
            return array[i].x;
        }
        xArray = appendArray(array[i].x, xArray, array[i].result, array[i].round);
    }

    console.log("xArray: " + JSON.stringify(xArray));
    var col = findBestCol(xArray, positions);
    return col;
}

function findBestCol(xArray, positions) {
    //use minimum losses if we don't have any wins or we can lose with the players first mark after us. Fallback to max wins and then to best ratio of wins/losses
    var bestCol = -1; //return this if there is an error

    var test = includesWinsAndLosses(xArray);
    if ((test === 0 && includesRoundOneLoss(xArray)) || test === -1) { //we have to consider the loss
        console.log("Minlosses");
        bestCol = getMinLosses(xArray, positions);
    }
    else if (test === 1) //includes only wins, choose one with most wins
    {
        console.log("maxwins");
        bestCol = getMaxWins(xArray);
    }
    else if (test === 0) {
        console.log("MaxRatio");
        bestCol = getMaxRatio(xArray);
    } 

    return bestCol;

}

function includesRoundOneLoss(xArray){
    /*function checks if cpu can lose on the first player round*/
    for (var i = 0; i < xArray.length; i++) {
        if (xArray[i].step === 1) {
            console.log("Includes loss");
            return true;
        }
    }

    return false;

}

function appendArray(x, xArray, result, step) {
    //add object to xArray if it doesn't exist, otherwise update data. xArray is used to keep data from each starting position (possible next move)

    for (var i = 0; i < xArray.length; i++) {

        if (x === xArray[i].parent) {
            if (result === 1) {
                xArray[i].wins = xArray[i].wins + 1;
                return xArray;
            }
            if (result === -1) {
               xArray[i].losses = xArray[i].losses + 1;

               if (xArray[i].step > step || isOdd(xArray[i].step))
                   xArray[i].step = step;

               return xArray;
           }

        }          
    }
    //not found, push new object
    var won = 0;
    var lost = 0;
    if (result === 1)
        won = won + 1;
    else if (result === -1)
        lost = lost + 1;

    var object = {parent: x, wins: won, losses: lost, step: step}
    xArray.push(object);

    return xArray;
}

function findTopY(x, cpyGameMap) {
    /*used to find highest row on column so we can delete it*/
    for (var i = 0 ; i < rows; i++) {
        if (!exceedsLimitations(x, i)) {
            if (cpyGameMap[i][x] !== 0)
                return i;
        }
    }
    return -1;
}

function removeSimMark(x, cpyBoard) {

    var y = findTopY(x, cpyBoard);

    if (y !== -1) {
        cpyBoard[y][x] = 0;
    }
    return cpyBoard;
}

function checkSimResult(cpyBoard, x, y, step, parentX) {
    /* function returns other than 0 if the game is over, so we know to stop recursion in the right place.*/
    var results = [];

    results.push(checkVector(y, x, 1, -1, cpyBoard));
    results.push(checkVector(y, x, 1, 0, cpyBoard));
    results.push(checkVector(y, x, 1, 1, cpyBoard));
    results.push(checkVector(y, x, 0, 1, cpyBoard));

    if (results.includes(1)) {
        var loss = { x: parentX, round: step, result: -1 };
        if (step === 1)
            console.log("Step 1 loss");
        array.push(loss);
        return -1; //losing
    }
    else if (results.includes(2)) {
        var win = { x: parentX, round: step, result: 1 };
        array.push(win);
        return 1; //winning
    }

    return 0; //game still going
}

function simPlaceMark(col, cpyBoard, step) {
    //simulate putting a mark on desired location. 
    var row = findPlace(col, cpyBoard);
    //console.log("Placing " + col + row);

    if (row !== -1) {
        if (isOdd(step)) {
            cpyBoard[row][col] = 1;
        }
        else {
            cpyBoard[row][col] = 2;
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
    /*used in the simulation to find a place to put the mark*/
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

function isOdd(num) { return (num % 2) == 1; }

function includesWinsAndLosses(xArray) {
    includesWins = false;
    includesLosses = false;

    for (var i = 0; i < xArray.length; i++){

        if (xArray[i].wins > 0)
            includesWins = true;
        if (xArray[i].losses > 0)
            includesLosses = true;
    }

    if (includesLosses && includesWins)
        return 0; //both
    else if (includesWins)
        return 1;
    else if (includesLosses)
        return -1;
    else
        return 9999;
}

function getMinLosses(xArray, positions) {
    /*we need to look for a column that has no losses. If none then the minimum amount*/
    var minIndex = xArray[0].parent;
    var minLosses = xArray[0].losses;

    for (var i = 0; i < positions.length; i++) { //all indexes
        var found = false;
        var col = positions[i].x;
        for (var j = 0; j < xArray.length; j++) {
            if (xArray[j].parent === col) {
                found = true;
                break;
            }
        }
        //if still not found, we return col
        if (!found) {
            console.log("no losses");
            return col;
        }
    }

    //drop down to least losses criteria

    for (var i = 0; i < xArray.length; i++) {

        if (xArray[i].losses < minLosses) {
            minLosses = xArray[i].losses;
            minIndex = xArray[i].parent;
        }
    }

    return minIndex;
}

function getMaxWins(xArray) {
    //returns the column of max wins
    var maxIndex = -1;
    var maxWins = -1;

    for (var i = 0; i < xArray.length; i++) {

        if (xArray[i].wins > maxWins) {
            maxWins = xArray[i].wins;
            maxIndex = xArray[i].parent;
        }
    }

    return maxIndex;
}

function getMaxRatio(xArray) {
    var maxRatio = -1;
    var bestCol = -1;

    for (var i = 0; i < xArray.length; i++) {
        if (xArray[i].wins > 0 && xArray[i].losses > 0) {
            var ratio = xArray[i].wins / xArray[i].losses;
            if (ratio > maxRatio) {
                maxRatio = ratio;
                bestCol = xArray[i].parent;
            }
        }
    }

    return bestCol;
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

/*debugging help*/

function printRowByRow(board) {
    console.log("Board: ");
    for (var i = 0; i < rows; i++) {
        console.log(JSON.stringify(board[i]));
    }

}

function mapLength(map) {
    /*helper function for debugging*/
    var count = 0;
    for (var i = 0; i < columns; i++) {

        for (var j = 0; j < rows; j++) {
            if (map[j][i] !== 0)
                count = count + 1;
        }

    }
    return count;
}