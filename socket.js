// /* 
//     This class handles all socket logic
// */

var socket = require('socket.io')
var index = require('./index')

var io = socket(index.server)

var playerSocket = new Set()
var spectatorSocket = new Set()

io.on('connection', function (socket) {

    // Let's us know that a connection has been established
    console.log('Connection made!')

    var handshakeData = socket.request;

    if(handshakeData._query['person'] == 'player') {
        if (playerSocket.size >= 2) {
            console.log('Too Big')
            socket.emit('getouttahere')
            socket.disconnect(true)
        } else {
            if(playerSocket.size == 0) {
                socket.emit('whosturn', {
                    turn: true, 
                    player: 'player 1'
                })
            } else if(playerSocket.size == 1) {
                socket.emit('whosturn', {
                    turn: false, 
                    player: 'player 2'
                })
            }
            playerSocket.add(socket.id)
        }
    } else if(handshakeData._query['person'] == 'spectator') {
        spectatorSocket.add(socket.id)
    }

    // Updates the board 
    socket.on('updateBoard', function (data) {
        io.sockets.emit('updateBoard', data)
    })

    socket.on('switchTurn', function() {
        io.sockets.emit('turnSwitched')
    })

    socket.on('disconnect', function () {
        playerSocket.delete(socket.id)
        spectatorSocket.delete(socket.id)
    })
})