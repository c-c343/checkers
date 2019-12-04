// Your Account SID from www.twilio.com/console
var accountSid = 'AC3621ee1a22d6b4bc8b9c587966774c34'

// Your Auth Token from www.twilio.com/console
var authToken = '86a50c71996b16cbd5f8b26e031e1a59'

var client = require('twilio')(accountSid, authToken);

/*
    Twilio class. Creates a blank subscribers list upon construction. 
*/
class Twilio {
    constructor() {
        this.subscribers = new Set()
    }
}

/*
    Adds a number to the subscriber list. Will be accessible through
    the DOM (Document Object Model)
*/
Twilio.prototype.subscribe = function (number) {
    this.subscribers.add(number)

    client.messages.create({
        body: 'Thank you for subscribing for updates! Text STOP to opt out of future updates',
        to: '+1' + number,  // Text this number
        from: '+19403995485' // From a valid Twilio number
    })
        .then((message) => console.log(message.sid))
    
    // We are returning a value for the purposes of our test script. Making sure number is the right format
    return '+1' + number

}

/*
    Deletes a number from the subscriber list. 
*/
Twilio.prototype.unsubscribe = function (number) {
    this.subscribers.delete(number)

    client.messages.create({
        body: 'You have unsubscribed from future updates',
        to: '+1' + number,  // Text this number
        from: '+19403995485' // From a valid Twilio number
    })
        .then((message) => console.log(message.sid));
    
}

/*
    Prints out all the numbers, more of a debugging 
    function than anything
*/
Twilio.prototype.printNumbers = function () {
    for (var i = 0; i < this.subscribers.length; i++) {
        console.log(this.subscribers[i])
    }
}

/*
    Pushes a notification to all observers when someone
    scores on the other in a multiplayer match
*/
Twilio.prototype.pushScoreNotification = function (scoringPlayer, player2, scoringPlayerScore, player2Score) {
    console.log('Just got to score notification')
    this.subscribers.forEach(number => {
        console.log('Number: ' + number)

        client.messages.create({
            body: scoringPlayer + ' scored against ' + player2 + '. The score is now ' + scoringPlayerScore + ' to ' + player2Score,
            to: '+1' + number,  // Text this number
            from: '+19403995485' // From a valid Twilio number
        })
            .then((message) => console.log(message.sid));
    })
}

/*
    Pushes a notification to all observers when the 
    game has ended
*/
Twilio.prototype.pushWinningNotification = function (winningPlayer, losingPlayer) {
    this.subscribers.forEach(number => {
        console.log('Number: ' + number)

        client.messages.create({
            body: winningPlayer + ' won against ' + losingPlayer,
            to: '+1' + this.subscribers[i],  // Text this number
            from: '+19403995485' // From a valid Twilio number
        })
            .then((message) => console.log(message.sid));
    })
}

global.Twilio = new Twilio()