const db = require('./db');
const {v4: uuid} = require('uuid');

const createChatTable = ()=>{
    return new Promise((resolve, reject)=>{
        const sql = `
            CREATE TABLE IF NOT EXISTS chat(
                id INTEGER PRIMARY KEY,
                content TEXT,
                user_id INTEGER,
                FOREIGN KEY(user_id) REFERENCES user(id)
            );
        `;
        db.run(sql, (err)=>{
            if(err){
                reject(err);
            }
            resolve();
        });
    });
}

const getMessages = ()=>{
    return new Promise((resolve, reject)=>{
        db.all('SELECT * FROM chat', (err, messages)=>{
            if(err){
                reject(err);
            }
            resolve(messages);
        })
    })
}

const addMessage = (message)=>{
    let content = message.content;
    let user_id = message.user_id;
    return new Promise((resolve, reject)=>{
        db.run('INSERT INTO chat(content, user_id) VALUES(?,?)', [content, user_id], (err)=>{
            if(err){
                reject(err);
            }
            resolve({content, user_id});
        })
    })
}

module.exports = {
    createChatTable,
    getMessages,
    addMessage,
}