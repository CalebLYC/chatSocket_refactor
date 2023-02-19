const chatModel = require('../models/chat');

const getMessages = (req, res)=>{
    chatModel.getMessages()
        .then(messages=>{
            return res.status(200).json({success: true, messages});
        }).catch(err =>{
            return res.status(500).json({success: false, message: err.message});
        })
}

const addMessage = (req, res)=>{
    const {content, user_id} = req.body;
    chatModel.addMessage({content, user_id})
        .then((message)=>{
            return res.status(200).json({success: true, message});
        }).catch(err=>{
            return res.status(500).json({success: false, message: err.message});
        })
}

module.exports = {
    getMessages,
    addMessage,
}