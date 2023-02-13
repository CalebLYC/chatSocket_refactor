const userModel = require('../models/user');

exports.getUsers = (req, res) => {
    userModel.getUsers()
        .then(users => {
            return res.status(200).json({success: true, users});
        })
        .catch(err => {
            return res.status(500).json({success: false, message: err.message});
        });
}

exports.createUser = (req, res) => {
    const {username, password, passwordConfirm} = req.body;
    if(password === passwordConfirm){
        userModel.addUser({username, password})
            .then(user => {
                res.status(200).json({success: true}, user);
            })
            .catch(err => {
                res.status(500).json({success: false, message: err.message});
            })
    }else{
        res.status(200).json({success: false, messqge: "Les mots de passe ne correspondent pas"});
    }
}

exports.login = (req, res) => {
    const username = req.body.username;
    userModel.userExists(username)
        .then(data => {
            if(data.exists){
                res.status(200).json({success: true, user: data.user});
            }else{
                res.status(500).json({success: false, message: 'Identifiant invalide'});
            }
        })
        .catch(err => {
            res.status(500).json({success: false, message: err.message});
        })
}

/*
// update a user
exports.updateUser = (req, res) => {
    const { username, email } = req.body;
    const { id } = req.params;
    db.run(
      "UPDATE USERS SET username = ?, email = ? WHERE id = ?",
      [username, email, id],
      function (err) {
        if (err) {
          return res.status(500).json({ success: false, message: err.message });
        }
        return res
          .status(200)
          .json({ success: true, message: `User ${id} updated.` });
      }
    );
  };
  
  // delete a user
  exports.deleteUser = (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM USERS WHERE id = ?", [id], function (err) {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
      return res.status(200).json({ success: true, message: `User ${id} deleted.` });
    });
  };*/