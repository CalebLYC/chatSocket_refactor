var socket = io();

var login = function(){
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    if(username == "" || password == ""){
        document.querySelector('.error').textContent = 'Identifiant invalide'
        return;
    }
    fetch('/login', {
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({username, password})
    }).then(response => response.json())
    .then(data => {
        if(data.success){
            socket.emit('user login', data.user);
            window.location.href = `/chat/create?id=${data.user.id}`;
        }else{
            document.querySelector('.error').textContent = 'Identifiant invalide'
        }
    })
}