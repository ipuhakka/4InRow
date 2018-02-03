// JavaScript source code for 4 in a row common functions used by both games

function isMobile() { 
		
			if( navigator.userAgent.match(/Android/i)
				|| navigator.userAgent.match(/webOS/i)
				|| navigator.userAgent.match(/iPhone/i)
				|| navigator.userAgent.match(/iPad/i)
				|| navigator.userAgent.match(/iPod/i)
				|| navigator.userAgent.match(/BlackBerry/i)
				|| navigator.userAgent.match(/Windows Phone/i)
			)
				return true;
			
			else 
				return false;
		}

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
			
			if (isMobile())
				element.className = 'mobileSquare';
			else 
				element.className = 'square';
			
            element.id = 'square' + i + '.' + j;
            element.style.backgroundColor = 'white';
		
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
    delayResult(row, col);
    switchTurn();
}

function updateScore(result) {

    locked = true;

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
    else if (result === 999)
    {
        alert("Tie game");
    }

    if (p1Score < 10)
        document.getElementById('p1Img').src = '../img/' + p1Score + '.png';

    if (p2Score < 10)
        document.getElementById('p2Img').src = '../img/' + p2Score + '.png';
}

function switchTurn() { //function shifts turns in game
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

function switchStart(){ //turn starting shift between games

    if (p1Start) {
        p1Start = false;
        player1Turn = false;
        if (cpu)
            document.getElementById('board').innerHTML = "CPU turn";
        else 
            document.getElementById('board').innerHTML = "P2 turn";
    }
    else {
        p1Start = true;
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
    switchStart();
    locked = false;
    createArea(); //start over

    if (cpu){//define AIDepth
        if (isNumber(document.getElementById('depth').value))
            MAXSTEPS = document.getElementById('depth').value;
        else {//default
            MAXSTEPS = 6;
            alert("Using default value 6");
            document.getElementById('depth').value = 6;
        }
    }

    if (!player1Turn && cpu)
        delayAI();
}

function clickedSquare(button) { /*click function that also control the structure of the game*/

    if ((!player1Turn && cpu) || locked)
        return;

    var btn = document.getElementById(button);

    var col = findColumn(button);
    var row = findRow(col);

    if (row !== -1) {
        markPress(col, row);
        if (!locked && cpu) {
            delayAI();
        }  
    }
    else
        console.log("Illegal move!");
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function delayResult(row, col){
    //this function is used to create a slight delay for AI so we get the user interface ready before checking the result
    setTimeout(function () { 
        checkResult(row, col);
    }, 10);
}

function delayAI() {
    setTimeout(function () { //we use a small timeout to get the gui change before we go to think the cpu's move
        decide(gameMap);
    }, 10);
}

