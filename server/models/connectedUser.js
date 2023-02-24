const db = require('./db');

const createConnectedUsersTable = ()=>{
    return new Promise((resolve, reject)=>{
        const sql = `
            CREATE TABLE IF NOT EXISTS connectedUsers(
                id INTEGER PRIMARY KEY,
                user_id INTEGER,
                username TEXT,
                chat_id TEXT,
                FOREIGN KEY(user_id) REFERENCES users(id),
                FOREIGN KEY(chat_id) REFERENCES chatsTable(id)
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

const getConnectedUsers = (chat_id)=>{
    return new Promise((resolve, reject)=>{
        db.all('SELECT * FROM connectedUsers WHERE chat_id=?',[chat_id], (err, connectedUsers)=>{
            if(err){
                reject(err);
            }
            resolve(connectedUsers);
        })
    })
}

const getConnectedUser = (user_id)=>{
    return new Promise((resolve, reject)=>{
        db.get('SELECT * FROM connectedUsers WHERE user_id=?', [user_id], (err, connectedUser)=>{
            if(err){
                reject(err);
            }
            resolve({exists: connectedUser != undefined, connectedUser});
        })
    })
}


const addConnectedUser = (user)=>{
    const {user_id, username, chat_id} = user;
    return new Promise((resolve, reject)=>{
        getConnectedUser(user_id)
            .then(data=>{
                if(!data.exists){
                    db.run('INSERT INTO connectedUsers(user_id, username, chat_id) VALUES(?,?,?)', [user_id, username, chat_id], (err)=>{
                        if(err){
                            reject(err);
                        }
                        resolve(user);
                    })
                }else{
                    resolve(user);
                }
            }).catch(err=>{
                reject(err);
            })
    })
}

const deleteConnectedUser = (id)=>{
    return new Promise((resolve, reject)=>{
        db.run('DELETE FROM connectedUsers WHERE user_id=?',[id],err=>{
            if(err){
                reject(err);
            }
            resolve();
        })
    })
}

module.exports = {
    createConnectedUsersTable,
    getConnectedUsers,
    getConnectedUser,
    addConnectedUser,
    deleteConnectedUser,
}