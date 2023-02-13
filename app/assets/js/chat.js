var socket = io();

let user;

socket.on('new user', (data)=>{
    alert(data.message + "\nFaites coucou à " + data.user.username)
})

socket.on('user disconnect', (data)=>{
    alert(data.message + "\nDites au revoir à " + data.user.username);
})

socket.on('disconnect redirect', (url)=>{
    window.location.href = url;
})

socket.on('users', (users)=>{
    document.getElementById('users').innerHTML = '';
    users.forEach(user => {
        var li = document.createElement('li');
        li.innerHTML =`<img src= './assets/img/userIcon.jpeg' class='userIcon' width='50' height='25' alt='userIcon' />  <span>${user.username}</span>`;
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
                'content-type': 'application/json'
            },
            body: JSON.stringify({user})
        }).then(response => response.json())
        .then((data) => {
            if(data.success){
                socket.emit('user disconnect', data.user);
            }else{
                alert('Erreur lors de la déconnexion\n' + data.message);
            }
        }) 
        .catch(err => {
            console.error(err);
            alert('Erreur lors de la déconnexion')
        })   
    }
}

socket.on('chat message', (msg)=>{
    var li = document.createElement('li');
    li.innerText = msg;
    document.getElementById('messages').appendChild(li);
})

const urlParms = new URLSearchParams(window.location.search);
const id = urlParms.get('id');

fetch(`/user?id=${id}`)
    .then(res => res.json())
    .then(data => {
        if(data.success){
            user = data.user;
            socket.emit('users', data.user);
        }else{
            console.error(data.message);
        }
    })
    .catch(err => console.error(err));
