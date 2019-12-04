function subscribe() {
    var number = $('#subscribe').val()
    console.log(number)
    if(number == '') {
        alert('You must specify a number')
    } else {
        window.location.replace('http://centipedecheckers.ngrok.io/subscribe/myNumber?number=' + number);
    }
}

function unsubscribe() {
    var number = $('#subscribe').val()
    if(number == '') {
        alert('You must specify a number')
    } else {
        window.location.replace('http://centipedecheckers.ngrok.io/unsubscribe/myNumber?number=' + number);
    }
}