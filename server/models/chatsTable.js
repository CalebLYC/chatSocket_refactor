const db = require('./db');
const {v4 : uuid} = require('uuid');

const createChatsTable = ()=>{
    return new Promise((resolve, reject)=>{
        const sql = `
            CREATE TABLE IF NOT EXISTS chatsTable(
                id INTEGER PRIMARY KEY,
                chat_id TEXT,
                admin TEXT,
                name TEXT,
                password TEXT,
                FOREIGN KEY(admin) REFERENCES users(id)
            );
        `;
        db.run(sql, err=>{
            if(err){
                reject(err);
            }
            resolve();
        })
    })
}

const addChat = (chat)=>{
    const {chatName, password, admin} = chat;
    const id = chat.id? chat.id : 'chat_'+Date.now();
    const sql = 'INSERT INTO chatsTable(chat_id, name, admin, password) VALUES(?, ?,?,?)';
    return new Promise((resolve, reject)=>{
        db.run(sql, [id, chatName, admin, password], (err)=>{
            if(err){
                reject(err);
            }
            resolve({id, chatName, password});
        })
    })
}

const getChat = (id) => {
    if (typeof id !== 'string') {
        console.log('Type invalide')
        return Promise.reject(new Error('Invalid chat ID'));
    }
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM chatsTable WHERE chat_id = ?', [id], (err, chat) => {
            if (err) {
                reject(err);
            } else {
                resolve({ exists: chat !== undefined, chat });
            }
        });
    });
};

const getChatById = (id) => {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM chatsTable WHERE id = ?', [id], (err, chat) => {
            if (err) {
                reject(err);
            } else {
                resolve({ exists: chat !== undefined, chat });
            }
        });
    });
};

  
  

const getChats = ()=>{
    return new Promise((resolve, reject)=>{
        db.all('SELECT * FROM chatsTable', (err, chats)=>{
            if(err){
                reject(err);
            }
            resolve(chats);
        })
    })
}

const deleteChat = ({id, userId})=>{
    return new Promise((resolve, reject)=>{
        getChatById(id)
            .then(data=>{
                if(data.exists){
                    if(data.chat.admin == userId){
                        db.run('DELETE FROM chatsTable WHERE id=?', [id], (err)=>{
                            if(err){
                                reject(err);
                            }
                            resolve();
                        })
                    }else{
                        reject({message: 'Cet utilisateur n\'a pas le droit de suprimer cet chat'})
                    }
                }else{
                    reject({message: 'Cet utilisateur n\'a pas le droit de suprimer cet chat'})
                }
            })
    })
}

module.exports = {
    getChats,
    getChat,
    createChatsTable,
    addChat,
    deleteChat,
}