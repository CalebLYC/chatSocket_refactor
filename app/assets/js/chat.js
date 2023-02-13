var socket = io();

socket.on('new user', (data)=>{
    alert(data.message + "\nFaites coucou à " + data.username)
})

socket.on('user disconnect', (username)=>{
    alert(data.message + "\nDites au revoir à " + username);
})

socket.on('disconnect redirect', (url)=>{
    window.location.href = url;
})

socket.on('users', (users)=>{
    users.forEach(user => {
        var li = document.createElement('li');
        li.innerText = user.id + " -- " + user.username;
        document.getElementById('users').appendChild(li);
    });
})

var send = function(){
    var msg = document.getElementById('m').value;
    socket.emit('chat message', msg);
    document.getElementById('m').value ='';
}

var disconnect = ()=>{
    if(confirm('Vous serez déconnecté')){
        fetch('/logout', {
            method: 'delete',
            headers: {
                'content-type': 'application.json'
            }
        }).then(response => response.json())
        .then((data) => {
            if(data.success){
                socket.emit('user disconnect', data.username);
            }else{
                alert('Erreur lors de la déconnexion')
            }
        })    
    }
}

socket.on('chat message', (msg)=>{
    var li = document.createElement('li');
    li.innerText = msg;
    document.getElementById('messages').appendChild(li);
})