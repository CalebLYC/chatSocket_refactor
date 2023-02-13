const sqlite3 = require('sqlite3').verbose();

const db = require('./db');//Connexion à la base de données(qui gère la fermeture de cete database)

//Création de la table users
const createUserTable = () => {
    return new Promise((resolve, reject)=>{
        const sql = `
            CREATE TABLE IF NOT EXISTS users(
                id INTENGER PRIMARY KEY,
                username TEXT NOT NULL,
                password TEXT NOT NULL
            );
        `;
        db.run(sql, (err)=>{
            if(err){
                reject(err);
            }
            resolve();
        })
    })
}

//Obtenir tous les utilisateurs
const getUsers = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM users", (err, users) => {
            if(err){
                reject(err)
            }
            resolve(users)
        })
    })
}

//AJout d'un utilisateur après vérification
const addUser = (user) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO users(id, username, password) VALUES(?, ?, ?)';
        let id = user.id ? user.id : Math.floor(Date.now());
        userExists(user.username).then(data => {
            if(data.exists){
                reject({message: 'Un utilisateur du même nom existe déjà'});
            }else{
                db.run(sql, [id, user.username, user.password], (err)=>{
                    if(err){
                        reject(err);
                    }
                    resolve({id, username: user.username, password: user.password});
                })
            }
        })
    })
}

//obtenir un utilisateur spécifique
const getUser = (id) => {
    return new Promise((resolve, reject)=>{
        const sql = 'SELECT * FROM users where id = ?';
        db.get(sql, [id], (err, user)=>{
            if(err){
                reject(err);
            }
            resolve(user);
        })
    })
}

//Vérifier si un utilisateur(au quel cas retourner cet utilisateur) ou pas
const userExists = (username) => {
    return new Promise((resolve, reject)=>{
        const sql = 'SELECT * FROM users where username = ?';
        db.get(sql, [username], (err, user)=>{
            if(err){
                reject(err);
            }
            resolve({exists: user !== undefined, user});
        })
    })
}

//Suppression d'un utilisateur
const deleteUser = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM users where id = ?';
        db.run(sql, id, (err) => {
            if(err){
                reject(err);
            }
            resolve();
        })
    })
}

//Mise à jour d'un utilisateur
const updateUser = ({user}) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE users SET username =?, password = ? WHERE id=?';
        db.run(sql, [user.username, user.password, user.id], (err) => {
            if(err){
                reject(err);
            }
            resolve();
        })
    })
}

module.exports = {
    getUsers,
    createUserTable,
    addUser,
    getUser,
    userExists,
    deleteUser,
    updateUser,
}