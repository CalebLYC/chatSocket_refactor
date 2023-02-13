const sqlite3 = require('sqlite3').verbose();

//Connexion à la base de données
const db = new sqlite3.Database('../mydb.db', (err)=>{
    if(err){
        return console.error(err);
    }
    console.log('Connecté à la base de données sqlite3');
})

//Fermeture de la base de données lorsque l'application est sur le point de s'arrêter
process.on('SIGINT', () => {
    console.log('\nFermeture de la base de données');
    db.close((err) => {
        if (err) {
            return console.error(err.message);
        }
        console.log('Base de données fermée');
    });
    process.exit();
});

module.exports = db;