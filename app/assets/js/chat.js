var socket = io();

/*define(function() {
    return { user: null };
  });*/
 let user; 
let chat;

window.onload = ()=>{
   document.querySelector('.send').scrollIntoView(true);
}

socket.on('new user', (data)=>{
    if(data.user.chat.chat_id === user.chat_id){
        alert(data.message + "\nFaites coucou à " + data.user.userInfos.username);
    }
})

socket.on('user disconnect', (data)=>{
    if(data.user.chat_id === user.chat_id){
        alert(data.message + "\nDites au revoir à " + data.user.username);
    }
})

socket.on('disconnect redirect', (url)=>{
    window.location.href = url;
})

socket.on('users', (data)=>{
    if(data.id === user.chat_id){
        document.getElementById('users').innerHTML = '';
        data.users.forEach(user => {
            var li = document.createElement('li');
            li.innerHTML =`<img src= './assets/img/userIcon.jpeg' class='userIcon' width='50' height='25' alt='userIcon' />  <span>${user.username}</span>`;
            document.getElementById('users').appendChild(li);
        });
    } 
})

var send = function(){
    var msg = document.getElementById('m').value;
    fetch('/chat/send',{
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({content:msg, user_id:user.user_id, chat:user.chat_id})
    }).then(response=>response.json())
    .then(data=>{
        if(data.success){
            socket.emit('chat message', {message: data.message, chat: user.chat_id});
            document.getElementById('m').value ='';
        }
    })
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
            alert('Erreur lors de la déconnexion')
        })   
    }
}

socket.on('chat message', (messages)=>{
    printMessages(messages);
})

const urlParms = new URLSearchParams(window.location.search);
const id = urlParms.get('id');

fetch(`/user?id=${id}`)
    .then(res => res.json())
    .then(data => {
        if(data.success){
            user = data.user;
            socket.emit('users', data.user);
            fetch(`/chat/get?chat=${user.chat_id}`)
                .then(res => res.json())
                .then(data=>{
        if(data.success){
            printMessages(data.messages);
        }
    })
        }else{
            console.error(data.message);
        }
    })
    .catch(err => console.error(err));


function printMessages(messages){
    document.getElementById('messages').innerHTML = '';
    messages.forEach(message => {
        var li = document.createElement('li');
        li.className = message.user_id==user.user_id ? 'myMessage' : 'otherMessage';
        li.innerText = message.content;
        document.getElementById('messages').appendChild(li);
    });
}

function getChats(){
    window.location.href = `/chats?id=${user.user_id}`
}