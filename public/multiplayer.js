function submitName() {
    var username = $('#name').val()
    if(username == '') {
        alert('You must specify a username')
    } else {
        window.location.replace('http://centipedecheckers.ngrok.io/multiplayer?username=' + username);
    }
}