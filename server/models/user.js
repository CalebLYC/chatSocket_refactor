const sqlite3 = require('sqlite3').verbose();

const db = require('./db');

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

const getUsers = () => {
    return new Promise((resolve, reject) => {
        db.all("SELECT * FROM USERS", (err, users) => {
            if(err){
                reject(err)
            }
            resolve(users)
        })
    })
}

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

module.exports = {
    getUsers,
    createUserTable,
    addUser,
    userExists,
}