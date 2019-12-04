// Establish connection to server on port 5000
// var socket = io.connect('http://localhost:5000')

var socket = io('https://centipedecheckers.ngrok.io', { 
    query: 'person=spectator' 
})

socket.connect()

socket.on('disconnected', function() {
    alert('Player has disconnected from the server')
})

/*
    If we are in production, use the IP address of the server
    to access from a phone
*/
// var socket = io.connect('http://192.168.6.93:5000')

// Set the size of the canvas based on the screen resolution
var canvas = document.getElementById('gamecanvas')

if (window.innerHeight < window.innerWidth) {
    canvas.width = window.innerHeight / 1.2
    canvas.height = window.innerHeight / 1.2
} else {
    canvas.width = window.innerWidth / 1.2
    canvas.height = window.innerWidth / 1.2
}

// Allows us to draw shapes on the screen
var c = canvas.getContext('2d')

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

function movePiece(x, y, i, playerNumber) {
    console.log('yooooo im in here')
    if (playerNumber == 1) {
        player1Pieces[i].x = x;
        player1Pieces[i].y = y;
    } else {
        player2Pieces[i].x = x;
        player2Pieces[i].y = y;
    }

    isSelected = false
    selectedCircle.x = ""
    selectedCircle.y = ""
    c.strokeStyle = 'rgba(20, 20, 20, 1)'
    animate()
}

// // Event listener that displays mouse coordinates
// canvas.addEventListener('mousedown', function (event) {
//     var mousePos = returnMousePos(canvas, event)

//     var pixelData = c.getImageData(mousePos.x, mousePos.y, 1, 1).data
//     var hex = 'rgba(' + pixelData[0] + ', ' + pixelData[1] + ', ' + pixelData[2] + ', 1)'

//     console.log("X: " + mousePos.x + " Y:" + mousePos.y + " " + hex)
//     console.log("")
//     console.log("Circle Location")

//     var lengthOfSquare = canvas.width / numRows

//     var x = ((Math.ceil(mousePos.x / lengthOfSquare)) * lengthOfSquare) - (lengthOfSquare / 2)
//     console.log("X: " + x)

//     var y = ((Math.ceil(mousePos.y / lengthOfSquare)) * lengthOfSquare) - (lengthOfSquare / 2)
//     console.log("Y: " + y)

//     if (hex == player1Color || hex == player2Color) {
//         if (!isSelected) {
//             selectPiece(x, y)
//         } else if (isSelected) {
//             // Deselects a game pieces
//             if (x == selectedCircle.x && y == selectedCircle.y) {
//                 deselectPiece()
//             }
//         }
//     /* 
//         If we have selected a piece, and where we click is not equal to player1 or player2's color, or a white square
//         or if the square that we selected is not within a certain frame
//     */
//     } else if (isSelected && hex != player1Color && hex != player2Color && hex != 'rgba(177, 177, 177, 1)') {
//         console.log('Selected X: ' + selectedCircle.x)
//         console.log('Selected Y: ' + selectedCircle.y)

//         for (var i = 0; i < player2Pieces.length; i++) {

//             var tempVarX = Math.abs(selectedCircle.x - player2Pieces[i].x)
//             var tempVarY = Math.abs(selectedCircle.y - player2Pieces[i].y)

//             console.log('tempVarX: ' + tempVarX)
//             console.log('tempVarY: ' + tempVarY)
//             console.log('')
//             // If we have found the piece in the collection of pieces
//             if (tempVarX < 20 && tempVarY < 20) {
//                 movePiece(x, y, i, 2)
//                 socket.emit('updateBoard', {
//                     player1: player1Pieces,
//                     player2: player2Pieces,
//                     dimension: canvas.width
//                 })
//             }
//         }
//         for (var i = 0; i < player1Pieces.length; i++) {

//             var tempVarX = Math.abs(selectedCircle.x - player1Pieces[i].x)
//             var tempVarY = Math.abs(selectedCircle.y - player1Pieces[i].y)

//             console.log('tempVarX: ' + tempVarX)
//             console.log('tempVarY: ' + tempVarY)
//             console.log('')

//             // If we have found the piece in the collection of pieces
//             if (tempVarX < 20 && tempVarY < 20) {
//                 movePiece(x, y, i, 1)
//                 socket.emit('updateBoard', {
//                     player1: player1Pieces,
//                     player2: player2Pieces,
//                     dimension: canvas.width
//                 })
//             }
//         }
//     }

// })

// socket.on('getouttahere', function() {
//     alert('Multiplayer lobby is full. To view this game as a spectator, type in the link you took you to this page + /spectator')
// })

socket.on('updateBoard', function (data) {

    var ratio = canvas.width / data.dimension

    for (var i = 0; i < data.player1.length; i++) {
        data.player1[i].x *= ratio
        data.player1[i].y *= ratio

        data.player2[i].x *= ratio
        data.player2[i].y *= ratio
    }

    player1Pieces = data.player1
    player2Pieces = data.player2

    animate()
})

// Variables to modify canvas properties
var isWhite = false;
var numRows = 9
var player1Color = 'rgba(66, 134, 244, 1)'
var player2Color = 'rgba(66, 244, 98, 1)'

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
        isAlive: true
    },
    {
        x: (canvas.width / numRows) / 2,
        y: (canvas.width / numRows) / 2 + (canvas.width / numRows),
        color: player1Color,
        isKing: false,
        isAlive: true
    },
    {
        x: (canvas.width / numRows) / 2 + (canvas.width / numRows),
        y: (canvas.width / numRows) / 2 + 2 * (canvas.width / numRows),
        color: player1Color,
        isKing: false,
        isAlive: true
    }
]

if (numRows % 2 == 0) {

    player2Pieces = [
        {
            x: (canvas.width / numRows) / 2,
            y: (canvas.width / numRows) / 2 + (canvas.width - 3 * (canvas.width / numRows)),
            color: player2Color,
            isKing: false,
            isAlive: true
        },
        {
            x: (canvas.width / numRows) / 2 + (canvas.width / numRows),
            y: (canvas.width / numRows) / 2 + (canvas.width - 2 * (canvas.width / numRows)),
            color: player2Color,
            isKing: false,
            isAlive: true
        },
        {
            x: (canvas.width / numRows) / 2,
            y: (canvas.width / numRows) / 2 + (canvas.width - (canvas.width / numRows)),
            color: player2Color,
            isKing: false,
            isAlive: true
        }
    ]
} else {
    player2Pieces = [
        {
            x: (canvas.width / numRows) / 2 + (canvas.width / numRows),
            y: (canvas.width / numRows) / 2 + (canvas.width - 3 * (canvas.width / numRows)),
            color: player2Color,
            isKing: false,
            isAlive: true
        },
        {
            x: (canvas.width / numRows) / 2,
            y: (canvas.width / numRows) / 2 + (canvas.width - 2 * (canvas.width / numRows)),
            color: player2Color,
            isKing: false,
            isAlive: true
        },
        {
            x: (canvas.width / numRows) / 2 + (canvas.width / numRows),
            y: (canvas.width / numRows) / 2 + (canvas.width - (canvas.width / numRows)),
            color: player2Color,
            isKing: false,
            isAlive: true
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
                isAlive: true
            })
        }
    }
}

calculatePieces(player1Pieces)
calculatePieces(player2Pieces)

function drawPieces(pieces) {
    console.log(pieces.length)
    for (var i = 0; i < pieces.length; i++) {
        c.beginPath()
        c.arc(pieces[i].x, pieces[i].y, 10, Math.PI * 2, false)
        c.fillStyle = pieces[i].color;
        c.fill();
        c.stroke()
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