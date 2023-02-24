const chatModel = require('../models/chat');
const chatsTableModel = require('../models/chatsTable');

const getMessages = (req, res)=>{
    const {chat} = req.query;
    chatModel.getMessages(chat)
        .then(messages=>{
            return res.status(200).json({success: true, messages});
        }).catch(err =>{
            return res.status(500).json({success: false, message: err.message});
        })
}

const addMessage = (req, res)=>{
    const {content, user_id, chat} = req.body;
    chatModel.addMessage({content, user_id, chat})
        .then((message)=>{
            return res.status(200).json({success: true, message});
        }).catch(err=>{
            return res.status(500).json({success: false, message: err.message});
        })
}

const createChat = (req, res)=>{
    const {chatName, password, passwordConfirm, admin} = req.body;
    if(password === passwordConfirm){
        chatsTableModel.addChat({chatName, password, admin})
            .then((chat)=>{
                chatModel.createChatTable(chat.id)
                    .then(()=>{
                        return res.status(200).json({success: true, chat});
                    }).catch(err => {
                        return res.status(500).json({success: false, message: err.message});
                    })
            })
            .catch(err=>{
                return res.status(500).json({success: false, message: err.message});
            })
    }else{
        return res.status(500).json({success: false, message: 'Les mots de passe ne correspondent pas'});
    }
}

const getChats = (req, res)=>{
    chatsTableModel.getChats()
        .then(chats=>{
            return res.status(200).json({success: true, chats});
        }).catch(err=>{
            return res.status(500).json({success:false, message:err.message});
        })
}

const deleteChat = (req, res)=>{
    const {id, userId} = req.body;
    chatsTableModel.deleteChat({id, userId})
        .then(()=>{
            chatsTableModel.getChats()
            .then(chats=>{
                return res.status(200).json({success: true, chats});
            }).catch(err=>{
                return res.status(500).json({success:false, message:err.message});
            })
        }).catch((err)=>{
            return res.status(500).json({success:false, message:err.message});
        })
}

module.exports = {
    getMessages,
    addMessage,
    createChat,
    getChats,
    deleteChat,
}