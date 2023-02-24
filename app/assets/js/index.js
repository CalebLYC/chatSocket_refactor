var socket = io();

socket.on('redirect', (url)=>{
    window.location.href = url;
})

var connect = function(){
    var username = document.getElementById('username').value;
    var chatId = document.getElementById('chatId').value;
    fetch('/connect', {
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({username, chatId})
    }).then(response => response.json())
    .then(data => {
        console.log(data)
        if(data.success){
            socket.emit('new user', data.user)
        }else{
            document.querySelector('.error').textContent = 'Identifiant invalide'
        }
    })
}


const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;