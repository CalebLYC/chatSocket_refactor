const socket = io();
/*require(['./chat.js'], function(module) {
    user = module.user;
  });*/
  const urlParms = new URLSearchParams(window.location.search);
  const id = urlParms.get('id');
    


const create = ()=>{
    if(id == null){
        alert('Veuillez vous connecter auparavant');
        window.location.href = '/login';
        return;
    }
    var chatName = document.getElementById('chatname').value;
    var password = document.getElementById('password').value;
    var admin = id ?? id;
    var passwordConfirm = document.getElementById('passwordConfirm').value;
    if(chatname == "" || password == ""){
        document.querySelector('.error').textContent = "Champs obligatoires";
        return;
    }
    if(password != passwordConfirm){
        document.querySelector('.error').textContent = "Les mots de passe ne sont pas confomes";
        return;
    }

    fetch('/chat/create', {
        method: 'post',
        headers: {
            'content-type': 'application/json',
        },
        body: JSON.stringify({chatName, password, passwordConfirm, admin}),
    })
    .then(res=>res.json())
    .then(data => {
        if(data.success){
            alert("Voici l'identifiant de votre chat, veuillez le noter: \n" + data.chat.id);
            window.location.href = '/';
        }else{
            document.querySelector('.error').innerHTML = data.message;
        }
    })
}