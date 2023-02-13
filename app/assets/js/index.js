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
        console.log(data)
        if(data.success){
            socket.emit('new user', data.username)
        }else{
            document.querySelector('.error').textContent = 'Identifiant invalide'
        }
    })
    /*document.querySelector('.home').classList.add('hide');
    document.querySelector('.chat').classList.remove('hide');*/
}