// Set the size of the canvas based on the screen resolution
var canvas = document.getElementById('gamecanvas')

if (window.innerHeight < window.innerWidth) {
    canvas.width = window.innerHeight / 1.2
    canvas.height = window.innerHeight / 1.2
} else {
    canvas.width = window.innerWidth / 1.2
    canvas.height = window.innerWidth / 1.2
}

myPoints = 0
AIPoints = 0

var myTurn = true
var myPlayerNumber

var playerColor = 'rgba(66, 134, 244, 1)'
var player1Color = 'rgba(66, 134, 244, 1)'
var player2Color = 'rgba(66, 244, 98, 1)'

// Allows us to draw shapes on the screen
var c = canvas.getContext('2d')

console.log('The canvas width is ' + canvas.width)

// Returns the mouse position
function returnMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

// Shows us the hex value of a pixel
function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

var selectedCircle = {
    x: "",
    y: ""
}

var isSelected = false

function selectPiece(x, y) {
    isSelected = true
    c.strokeStyle = 'rgba(255, 255, 255, 1)'
    selectedCircle.x = x
    selectedCircle.y = y
    c.lineWidth = 2

    c.beginPath()
    c.arc(x, y, 10, Math.PI * 2, false)
    c.stroke()
}

function deselectPiece() {
    isSelected = false
    selectedCircle.x = ""
    selectedCircle.y = ""
    c.strokeStyle = 'rgba(20, 20, 20, 1)'
    animate()
}

var AISet = new Set()

function AITurn() {
    console.log('AI Turn')
    var thisAIturn = true

    while (thisAIturn) {

        var index = Math.floor(Math.random() * player2Pieces.length)

        if (player2Pieces[index].isAlive) {
            thisAIturn = false

            selectedCircle.x = player2Pieces[index].x
            selectedCircle.y = player2Pieces[index].y

            tryToMove(index, Math.floor(Math.random() * 2) + 1)
            console.log('x: ' + player2Pieces[index].x + ' and y: ' + player2Pieces[index].y)

        }
    }
}

function tryToMove(index, numSpaces) {
    currentX = player2Pieces[index].x
    currentY = player2Pieces[index].y

    var halfwayX
    var halfwayY

    modifyX = Math.floor(Math.random() * 2)
    modifyY = Math.floor(Math.random() * 2)

    setTimeout(function () {
        if (modifyX == 0) {
            // Add to X
            currentX += ((canvas.width / numRows) * numSpaces)
            halfwayX = (currentX + selectedCircle.x) / 2
        } else {
            currentX -= ((canvas.width / numRows) * numSpaces)
            halfwayX = (currentX + selectedCircle.x) / 2
        }

        if (modifyY == 0) {
            currentY += ((canvas.width / numRows) * numSpaces)
            halfwayY = (currentY + selectedCircle.y) / 2
        } else {
            currentY -= ((canvas.width / numRows) * numSpaces)
            halfwayY = (currentY + selectedCircle.y) / 2
        }
    }, 50)


    setTimeout(function () {
        if (numSpaces == 1) {
            // We try to move one spaces
            if (currentX < canvas.width && currentX >= 30 && currentY < canvas.width && currentY >= 30 && !hasPiece(currentX, currentY) && !isMovingHorizontal(selectedCircle, currentX, currentY) && isMovingInRightDirection(selectedCircle, currentX, currentY)) {
                movePiece(currentX, currentY, index, 2, 1)
                animate()
            } else {
                setTimeout(function () {
                    AITurn()
                }, 60)
            }

        } else {
            // We try to move two spaces
            if (currentX < canvas.width && currentX >= 30 && currentY < canvas.width && currentY >= 30 && !hasPiece(currentX, currentY) && !isMovingHorizontal(selectedCircle, currentX, currentY) && isMovingInRightDirection(selectedCircle, currentX, currentY) && hasPiece(halfwayX, halfwayY) && !isSameColor(halfwayX, halfwayY)) {
                movePiece(currentX, currentY, index, 2, 2)
                deletePiece(halfwayX, halfwayY)
                AIPoints++
                if (AIPoints >= 13) {
                    alert('You have lost the match!')

                }

                animate()
            } else {
                setTimeout(function () {
                    AITurn()
                }, 60)
            }
        }
    }, 70)
}

function movePiece(x, y, i, playerNumber, multiply) {
    if (playerNumber == '1') {
        player1Pieces[i].x = x
        player1Pieces[i].y = y
        player1Pieces[i].position += (1 * multiply)

        setTimeout(function () {
            if (player1Pieces[i].position >= 9) {
                player1Pieces[i].isKing = true
            }
        }, 500)

    } else {
        player2Pieces[i].x = x
        player2Pieces[i].y = y
        player2Pieces[i].position += (1 * multiply)

        setTimeout(function () {
            if (player2Pieces[i].position >= 9) {
                player2Pieces[i].isKing = true
            }
        }, 500)

    }

    console.log('We moved a piece to ' + x + ',' + y)

    isSelected = false
    selectedCircle.x = ""
    selectedCircle.y = ""
    c.strokeStyle = 'rgba(20, 20, 20, 1)'

    if (myTurn) {
        myTurn = false
        console.log('Not my turn')
        playerColor = 'rgba(66, 244, 98, 1)'
        setTimeout(function () {
            AITurn()
        }, 60)
    } else {
        playerColor = 'rgba(66, 134, 244, 1)'
        myTurn = true
    }

    animate()

}

function hasPiece(x, y) {

    for (var i = 0; i < player1Pieces.length; i++) {
        if ((Math.floor(x) == Math.floor(player1Pieces[i].x) || Math.ceil(x) == Math.ceil(player1Pieces[i].x)) &&
            (Math.floor(y) == Math.floor(player1Pieces[i].y) || Math.ceil(y) == Math.ceil(player1Pieces[i].y))) {
            console.log('piece there')
            return true
        }
    }

    for (var i = 0; i < player2Pieces.length; i++) {
        if ((Math.floor(x) == Math.floor(player2Pieces[i].x) || Math.ceil(x) == Math.ceil(player2Pieces[i].x)) &&
            (Math.floor(y) == Math.floor(player2Pieces[i].y) || Math.ceil(y) == Math.ceil(player2Pieces[i].y))) {
            console.log('piece there')
            return true
        }
    }
    console.log('piece not there')
    return false;
}

function isSameColor(x, y) {
    var pixelData = c.getImageData(x, y, 1, 1).data
    var hex = 'rgba(' + pixelData[0] + ', ' + pixelData[1] + ', ' + pixelData[2] + ', 1)'

    if (hex == playerColor) {
        console.log('same color')
        return true
    } else {
        console.log('not same color')
        return false
    }
}

function isMovingHorizontal(selectedCircle, x, y) {
    if (selectedCircle.x == x || selectedCircle.y == y) {
        console.log('moving horizontal')
        return true;
    }

    console.log('not moving horizontal')
    return false;
}

function displayPlayer2() {
    console.log('Printing out player 2 pieces!')
    for (var i = 0; i < player2Pieces.length; i++) {
        console.log('Index ' + (i + 1) + ' ' + player2Pieces[i].x + ' , ' + player2Pieces[i].y)
    }
}


function deletePiece(x, y) {
    console.log('WE JUST DELETED A PIECE AT ' + '(' + x + ')' + '(' + y + ')')
    for (var i = 0; i < player1Pieces.length; i++) {
        if ((Math.floor(player1Pieces[i].x) == Math.floor(x) || Math.ceil(player1Pieces[i].x) == Math.ceil(x)) &&
            (Math.floor(player1Pieces[i].y) == Math.floor(y) || Math.ceil(player1Pieces[i].y) == Math.ceil(y))) {
            player1Pieces[i].x = -100
            player1Pieces[i].y = -100
            player1Pieces[i].isAlive = false
        }
    }

    for (var i = 0; i < player2Pieces.length; i++) {
        if ((Math.floor(player2Pieces[i].x) == Math.floor(x) || Math.ceil(player2Pieces[i].x) == Math.ceil(x)) &&
            (Math.floor(player2Pieces[i].y) == Math.floor(y) || Math.ceil(player2Pieces[i].y) == Math.ceil(y))) {
            player2Pieces[i].x = -100
            player2Pieces[i].y = -100
            player2Pieces[i].isAlive = false
        }
    }
}

function isMovingInRightDirection(selectedCircle, x, y) {
    // Look through player 1 pieces
    for (var i = 0; i < player1Pieces.length; i++) {
        var tempVarX = Math.abs(selectedCircle.x - player1Pieces[i].x)
        var tempVarY = Math.abs(selectedCircle.y - player1Pieces[i].y)

        if (Math.floor(tempVarX) == 0 && Math.floor(tempVarY) == 0) {
            //We have found the piece
            if (player1Pieces[i].isKing) {
                console.log('Right direction')
                return true
            } else {

                if (player1Pieces[i].direction == 'up') {
                    if (selectedCircle.y > y) {
                        console.log('Right direction')
                        return true
                    } else {

                        console.log('Wrong direction')
                        return false
                    }
                } else {
                    if (selectedCircle.y < y) {
                        console.log('Right direction')
                        return true
                    } else {
                        console.log('thisone')
                        console.log('Wrong direction')
                        return false
                    }
                }
            }
        }
    }

    // Look through player 2 pieces
    for (var i = 0; i < player2Pieces.length; i++) {
        var tempVarX = Math.abs(selectedCircle.x - player2Pieces[i].x)
        var tempVarY = Math.abs(selectedCircle.y - player2Pieces[i].y)

        if (Math.floor(tempVarX) == 0 && Math.floor(tempVarY) == 0) {
            //We have found the piece
            if (player2Pieces[i].isKing) {
                return true
            } else {

                if (player2Pieces[i].direction == 'up') {
                    console.log('We are up')
                    if (selectedCircle.y > y) {
                        return true
                    } else {
                        return false
                    }
                } else {
                    if (selectedCircle.y < y) {
                        return true
                    } else {
                        return false
                    }
                }
            }
        }
    }
    // Find piece
    // If king, return true
    // If else, determine if moving in right direction
}

function getPoints() {
    console.log('AI: ' + AIPoints + ' Me: ' + myPoints)
}

// Event listener that displays mouse coordinates
canvas.addEventListener('mousedown', function (event) {
    if (myTurn) {

        var mousePos = returnMousePos(canvas, event)

        var pixelData = c.getImageData(mousePos.x, mousePos.y, 1, 1).data
        var hex = 'rgba(' + pixelData[0] + ', ' + pixelData[1] + ', ' + pixelData[2] + ', 1)'

        // console.log("X: " + mousePos.x + " Y:" + mousePos.y + " " + hex)
        // console.log("")
        // console.log("Circle Location")

        var lengthOfSquare = canvas.width / numRows

        var x = ((Math.ceil(mousePos.x / lengthOfSquare)) * lengthOfSquare) - (lengthOfSquare / 2)
        console.log("X: " + x)

        var y = ((Math.ceil(mousePos.y / lengthOfSquare)) * lengthOfSquare) - (lengthOfSquare / 2)
        console.log("Y: " + y)

        // var isPiece = hasPiece(x, y)

        // console.log('Is there piece?: ' + isPiece)

        var halfwayX = (x + selectedCircle.x) / 2
        var halfwayY = (y + selectedCircle.y) / 2

        if (hex == playerColor) {
            if (!isSelected) {
                selectPiece(x, y)
            } else if (isSelected) {
                // Deselects a game pieces
                if (x == selectedCircle.x && y == selectedCircle.y) {
                    deselectPiece()
                }
            }
            /* 
                If we have selected a piece, and where we click is not equal to player1 or player2's color, or a white square
                or if the square that we selected is not within a certain frame
            */
        } else if (isSelected && hex != playerColor && hex != 'rgba(177, 177, 177, 1)') {
            // console.log('Selected X: ' + selectedCircle.x)
            // console.log('Selected Y: ' + selectedCircle.y)

            var pointDistance = Math.ceil(Math.sqrt(Math.pow(selectedCircle.y - y, 2) + Math.pow(selectedCircle.x - x, 2)))
            var squareDiagonal = Math.ceil(lengthOfSquare * Math.sqrt(2))


            if (pointDistance <= squareDiagonal) {

                // Check to see if a person is already on that square first, write function. Pass x and y and return bool
                if (!hasPiece(x, y) && !isMovingHorizontal(selectedCircle, x, y) && isMovingInRightDirection(selectedCircle, x, y)) {

                    for (var i = 0; i < player2Pieces.length; i++) {

                        var tempVarX = Math.floor(selectedCircle.x) - Math.floor(player2Pieces[i].x)
                        var tempVarY = Math.floor(selectedCircle.y) - Math.floor(player2Pieces[i].y)
                        // If we have found the piece in the collection of pieces
                        if (tempVarX == 0 && tempVarY == 0) {
                            movePiece(x, y, i, 2, 1)
                            animate()

                        }
                    }
                    for (var i = 0; i < player1Pieces.length; i++) {

                        var tempVarX = Math.floor(selectedCircle.x) - Math.floor(player1Pieces[i].x)
                        var tempVarY = Math.floor(selectedCircle.y) - Math.floor(player1Pieces[i].y)

                        // If we have found the piece in the collection of pieces
                        if (tempVarX == 0 && tempVarY == 0) {
                            movePiece(x, y, i, 1, 1)
                            animate()


                        }
                    }
                }
                // Jump over piece
            } else if (pointDistance > squareDiagonal && pointDistance <= (2 * squareDiagonal)) {
                // Check to see if a person is already on that square first, write function. Pass x and y and return bool
                if (!hasPiece(x, y) && !isMovingHorizontal(selectedCircle, x, y) && isMovingInRightDirection(selectedCircle, x, y) && hasPiece(halfwayX, halfwayY) && !isSameColor(halfwayX, halfwayY)) {

                    myPoints++

                    if (myPoints >= 13) {
                        alert('You have won the match!')
                    }

                    deletePiece(halfwayX, halfwayY)

                    for (var i = 0; i < player2Pieces.length; i++) {

                        var tempVarX = Math.floor(selectedCircle.x) - Math.floor(player2Pieces[i].x)
                        var tempVarY = Math.floor(selectedCircle.y) - Math.floor(player2Pieces[i].y)
                        // If we have found the piece in the collection of pieces
                        if (tempVarX == 0 && tempVarY == 0) {
                            movePiece(x, y, i, 2, 2)
                            animate()

                        }
                    }
                    for (var i = 0; i < player1Pieces.length; i++) {

                        var tempVarX = Math.floor(selectedCircle.x) - Math.floor(player1Pieces[i].x)
                        var tempVarY = Math.floor(selectedCircle.y) - Math.floor(player1Pieces[i].y)

                        // If we have found the piece in the collection of pieces
                        if (tempVarX == 0 && tempVarY == 0) {
                            movePiece(x, y, i, 1, 2)
                            animate()

                        }
                    }

                }
            }
        }
    }
})

// Variables to modify canvas properties
var isWhite = false;
var numRows = 9


var checkersPiece = {
    x: (canvas.width / 10) / 2,
    y: (canvas.width / 10) / 2
}

/*
    These are the seed pieces that will be used to generate all
    other game pieces on the board
*/

var player1Pieces = []
var player2Pieces = []

player1Pieces = [
    {
        x: (canvas.width / numRows) / 2 + (canvas.width / numRows),
        y: (canvas.width / numRows) / 2,
        color: player1Color,
        isKing: false,
        isAlive: true,
        direction: 'down',
        position: 1
    },
    {
        x: (canvas.width / numRows) / 2,
        y: (canvas.width / numRows) / 2 + (canvas.width / numRows),
        color: player1Color,
        isKing: false,
        isAlive: true,
        direction: 'down',
        position: 2
    },
    {
        x: (canvas.width / numRows) / 2 + (canvas.width / numRows),
        y: (canvas.width / numRows) / 2 + 2 * (canvas.width / numRows),
        color: player1Color,
        isKing: false,
        isAlive: true,
        direction: 'down',
        position: 3
    }
]

if (numRows % 2 == 0) {

    player2Pieces = [
        {
            x: (canvas.width / numRows) / 2,
            y: (canvas.width / numRows) / 2 + (canvas.width - 3 * (canvas.width / numRows)),
            color: player2Color,
            isKing: false,
            isAlive: true,
            direction: 'up',
            position: 3
        },
        {
            x: (canvas.width / numRows) / 2 + (canvas.width / numRows),
            y: (canvas.width / numRows) / 2 + (canvas.width - 2 * (canvas.width / numRows)),
            color: player2Color,
            isKing: false,
            isAlive: true,
            direction: 'up',
            position: 2
        },
        {
            x: (canvas.width / numRows) / 2,
            y: (canvas.width / numRows) / 2 + (canvas.width - (canvas.width / numRows)),
            color: player2Color,
            isKing: false,
            isAlive: true,
            direction: 'up',
            position: 1
        }
    ]
} else {
    player2Pieces = [
        {
            x: (canvas.width / numRows) / 2 + (canvas.width / numRows),
            y: (canvas.width / numRows) / 2 + (canvas.width - 3 * (canvas.width / numRows)),
            color: player2Color,
            isKing: false,
            isAlive: true,
            direction: 'up',
            position: 3
        },
        {
            x: (canvas.width / numRows) / 2,
            y: (canvas.width / numRows) / 2 + (canvas.width - 2 * (canvas.width / numRows)),
            color: player2Color,
            isKing: false,
            isAlive: true,
            direction: 'up',
            position: 2
        },
        {
            x: (canvas.width / numRows) / 2 + (canvas.width / numRows),
            y: (canvas.width / numRows) / 2 + (canvas.width - (canvas.width / numRows)),
            color: player2Color,
            isKing: false,
            isAlive: true,
            direction: 'up',
            position: 1
        }
    ]
}

/*
    Loops through each seed piece in a players set
    of pieces and generates the rest of the pieces
    that the player will have on the board
*/
function calculatePieces(pieces) {
    for (var i = 0; i < 3; i++) {
        for (var coordX = pieces[i].x + 2 * (canvas.width / numRows); coordX < canvas.width; coordX += (canvas.width / numRows) * 2) {
            pieces.push({
                x: coordX,
                y: pieces[i].y,
                color: pieces[i].color,
                isKing: false,
                isAlive: true,
                direction: pieces[i].direction,
                position: pieces[i].position
            })
        }
    }
}

calculatePieces(player1Pieces)
calculatePieces(player2Pieces)

// Only draw pieces that are alive
function drawPieces(pieces) {
    console.log(pieces.length)
    for (var i = 0; i < pieces.length; i++) {
        if (pieces[i].isAlive && !pieces[i].isKing) {
            c.beginPath()
            c.arc(pieces[i].x, pieces[i].y, 10, Math.PI * 2, false)
            c.fillStyle = pieces[i].color;
            c.fill();
            c.stroke()
        } else if (pieces[i].isAlive && pieces[i].isKing) {
            var oldFillStyle = c.fillStyle

            c.beginPath()
            c.arc(pieces[i].x, pieces[i].y, 10, Math.PI * 2, false)
            c.fillStyle = pieces[i].color;
            c.fill()
            c.stroke()

            c.strokeStyle = '#cc8ee5'
            c.beginPath()
            c.arc(pieces[i].x, pieces[i].y, 12, Math.PI * 2, false)
            //c.fillStyle = pieces[i].color;
            c.fill()
            c.stroke()
            c.fillStyle = oldFillStyle

            c.strokeStyle = '#000000'


        }
    }
}


/* 
    Function that draws the initial gameboard, and deterines if a square on the board should have
    a game piece on it or not
*/

function draw(i, x, y, isWhite, hasCheckers, color) {
    if (i < numRows) {
        if (isWhite) {
            c.fillStyle = 'rgba(177,177,177,1)'
            c.fillRect(x, y, canvas.width / numRows, canvas.width / numRows)
            draw(i + 1, x + canvas.width / numRows, y, !isWhite, hasCheckers, color)
        } else {
            c.fillStyle = 'rgba(20,20,20,1)'
            c.fillRect(x, y, canvas.width / numRows, canvas.width / numRows)
            draw(i + 1, x + canvas.width / numRows, y, !isWhite, hasCheckers, color)
        }
    }
}

function drawBoard() {

    for (var i = 0, y = 0; i < numRows; i++ , y += canvas.width / numRows) {
        if (isWhite) {
            if (i >= 0 && i < 3) {
                draw(0, 0, y, false, true, player1Color)
            } else if (i < numRows && i >= numRows - 3) {
                draw(0, 0, y, false, true, player2Color)
            } else {
                draw(0, 0, y, false, false)
            }
            isWhite = !isWhite
        } else {
            if ((i >= 0 && i < 3)) {
                draw(0, 0, y, true, true, player1Color)
            } else if (i < numRows && i >= numRows - 3) {
                draw(0, 0, y, true, true, player2Color)
            } else {
                draw(0, 0, y, true, false)
            }
            isWhite = !isWhite
        }
    }
    // Ensures that the gameboard square colors won't be inverted
    if (numRows % 2 == 1) {
        isWhite = !isWhite
    }
}

function animate() {
    c.clearRect(0, 0, innerWidth, innerHeight)
    drawBoard()
    drawPieces(player1Pieces)
    drawPieces(player2Pieces)
}

animate(); 