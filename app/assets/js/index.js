var socket = io();

socket.on('redirect', (url)=>{
    window.location.href = url;
})

var connect = function(){
    var username = document.getElementById('username').value;
    fetch('/login', {
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({username})
    }).then(response => response.json())
    .then(data => {
        if(data.success){
            socket.emit('new user', data.user)
        }else{
            document.querySelector('.error').textContent = 'Identifiant invalide'
        }
    })
    /*document.querySelector('.home').classList.add('hide');
    document.querySelector('.chat').classList.remove('hide');*/
}


const PORT = 3001;
const BASE_URL = `http://localhost:${PORT}`;