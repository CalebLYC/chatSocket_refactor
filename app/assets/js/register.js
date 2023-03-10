var socket = io();

var register = ()=>{
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var passwordConfirm = document.getElementById('passwordConfirm').value;
    if(username == "" || password == ""){
        document.querySelector('.error').textContent = "Champs obligatoires";
        return;
    }
    if(password != passwordConfirm){
        document.querySelector('.error').textContent = "Les mots de passe ne sont pas confomes";
        return;
    }
    fetch('/register', {
        method: 'post',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({username, password, passwordConfirm})
    }).then(response => response.json())
    .then(data => {
        console.log(data)
        if(data.success){
            window.location.href = '/';
        }else{
            alert("Erreur lors de l'inscription");
        }
    })
}