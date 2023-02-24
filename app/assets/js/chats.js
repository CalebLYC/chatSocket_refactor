var socket = io();

const urlParms = new URLSearchParams(window.location.search);
  const userId = urlParms.get('id');

fetch('/chat/getChats')
    .then(res => res.json())
    .then(data=>{
        if(data.success){
            printChats(data.chats);
        }else{
            console.log(data.message);
        }
    })

function printChats(chats){
    document.querySelector('.chats').innerHTML = '';
    chats.forEach(chat => {
        var li = document.createElement('li');
        li.innerText = chat.name;
        var button = `<button onclick = 'remove(${chat.id})'>Supprimer</button>`;
        li.innerHTML += button;
        document.querySelector('.chats').appendChild(li);
    });
}

function remove(id){
    if(confirm('Voulez-vous vraiment supprimer ce chat ?\nCet action est irréversible')){
        fetch('/chat/delete', {
            method: 'delete',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({id, userId})
        }).then(res=>res.json())
        .then(data=>{
            if(data.success){
                printChats(data.chats);
            }else{
                alert(data.message);
            }
        })
    }
}