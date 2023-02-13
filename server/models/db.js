const db = new sqlite3.Database('../mydb.db', (err)=>{
    if(err){
        return console.error(err);
    }
    console.log('Connecté à la base de données sqlite3');
})

module.exports = {db};