// JavaScript source code for AI that simulates the score to find out which position is optimal. Scoring: -1 -Opponent wins, 0: Game is still going, 1: CPU wins
//If game allows (not too many possible combinations) it can be used optimally, which means going back to end of the game. MiniMax selects the best possible move
//assuming that opponent plays perfectly. To make the AI feel more real we randomise the chosen column if all possible moves have the same value.

const SCORE = 100; //score  is used to calculate a value for a board configuration relative to the move at hand (further move gets a smaller score). It needs to be higher than the number of steps simulation uses

function decide(gameMap) {

    if (locked) {
        return;
    }

    var results = [];
    var col = -1;
    var positions = availablePositions(gameMap);
    var STEPS = (columns * rows) - mapLength(gameMap); 

    if (STEPS > MAXSTEPS) //limit the steps so that the game is not too slow
        STEPS = MAXSTEPS;

    var t0 = performance.now();
    for (var i = 0; i < positions.length; i++) {
        var cpyGameMap = copyGameMap(gameMap);
        results = recursiveSimulation(cpyGameMap, 0, positions[i], results, STEPS);

        removeSimMark(positions[i].x, positions[i].y, cpyGameMap);

        if (results[results.length - 1] === SCORE) {//optimal result found
            console.log("Sure win at " + positions[i].x);
            break;
        }
        
    }
    var t1 = performance.now();
    console.log("took " + (t1 - t0) + " milliseconds.");
    console.log("Step 0: " + JSON.stringify(results));

    var index = chooseColumn(positions, results); //choose the column to play

    place(positions[index].x); //place position with the index of max value
}

function recursiveSimulation(cpyGameMap, step, position, array, STEPS) {
    /* This recursive function implements the minimax algorithm. It goes to maximum depth (1. game has ended. 2. target depth has been reached)
    and pushes the result there to the parameter array and returns it. For every step we check if the result is optimal (then return the optimal result
    back up another level) or if it's 0 then we check the next possible move for this step. In each node we push the optimal value to the array of the
    ancestor node.*/
    var resArray = [];
    var map = cpyGameMap;
    cpyGameMap = simPlaceMark(position.x, position.y, cpyGameMap, step);

    var res = checkSimResult(cpyGameMap, position.x, position.y);

    if (res !== 0 || step === (STEPS - 1)) {  //push to array and return it

        if (res === 999) //game ended in draw
            res = 0;

        array.push(res * (SCORE - step));
        return array;
    }

    step = step + 1;
    var positions = availablePositions(cpyGameMap);

    for (var i = 0; i < positions.length; i++) {
        resArray = recursiveSimulation(cpyGameMap, step, positions[i], resArray, STEPS);

        cpyGameMap = removeSimMark(positions[i].x, positions[i].y, cpyGameMap);
        if (resArray[resArray.length - 1] === (-1 * (SCORE - step)) && isOdd(step)) //minimizer has the optimal result, return
        {
            array.push(-1 * (SCORE - step));
            return array;
        }

        if (resArray[resArray.length - 1] === (1 * (SCORE - step)) && !isOdd(step)) //maximizer has the optimal result, return
        {
            array.push(1 * (SCORE - step));
            return array;
        } 
    }

    //when we get here we push the optimal value of resArray to the array of the upper level node
    if (isOdd(step)) { //minimizer
        array.push(minValue(resArray));
    }
    else { //maximizer
        array.push(maxValue(resArray));
    }
    return array; //on this level nothing happened
}

function maxIndex(array){
    //for the step 0 we need to get the index of optimal move in order to actually make the move
    var max = array[0];
    var index = 0;

    for (var i = 0; i < array.length; i++) {
        if (array[i] > max){
            max = array[i];
            index = i;
        }
    }

    return index;
}

function minValue(array) {
    //return min. value

    var min = array[0];

    for (var i = 0; i < array.length; i++) {
        if (array[i] < min)
            min = array[i];
    }

    return min;
}

function maxValue(array) {
    //return max. value
    var max = array[0];

    for (var i = 0; i < array.length; i++) {
        if (array[i] > max)
            max = array[i];
    }

    return max;
}

function checkSimResult(cpyBoard, x, y) {
    /* function returns other than 0 if the game is over, so we know to stop recursion in the right place.*/
    var results = [];

    results.push(checkVector(y, x, 1, -1, cpyBoard));
    results.push(checkVector(y, x, 1, 0, cpyBoard));
    results.push(checkVector(y, x, 1, 1, cpyBoard));
    results.push(checkVector(y, x, 0, 1, cpyBoard));

    if (results.includes(1)) {
        return -1; //losing
    }
    else if (results.includes(2)) {
        return 1; //winning
    }

    if (boardIsFull(cpyBoard))
        return 999;

    return 0; //game still going
}

function simPlaceMark(col, row, cpyBoard, step) {
    //simulate putting a mark on desired location. 

    if (isOdd(step)) {
        cpyBoard[row][col] = 1;
    }
    else {
        cpyBoard[row][col] = 2;
    }

    return cpyBoard;
}

function removeSimMark(x, y, cpyBoard) {
    cpyBoard[y][x] = 0;
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
    for (var i = (rows - 1) ; i >= 0; i--) {
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

function isOdd(num) { return (num % 2) == 1; }

function place(col) {
    //place the actual mark
	if (locked) {
		console.log("Not placed, game over");
        return;
    }
	
    var row = findRow(col);
    markPress(col, row);

}

function chooseColumn(positions, results) {
    //if it doesn't matter where we play we should play as center as possible
    //Find max value, create array of their indexes, randomise an index, and return the index of that position in the original positions list
    var maxVal = maxValue(results);
    var indexes = []; //contains all the indexes of positions with max value, and their index in positions array

    for (var i = 0; i < results.length; i++) {
        if (results[i] == maxVal) {
            indexes.push(i);
        }
    }

    if (indexes.length === 1)
        return indexes[0];

    var index = Math.floor(indexes.length / 2); //get the index of middle possibility
    var col = indexes[index];
    return col; //index
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

/*debugging help below*/

function printRowByRow(board) {
    console.log("Board: ");
    for (var i = 0; i < rows; i++) {
        console.log(JSON.stringify(board[i]));
    }

}
