const User = require('../model/User');
const ActivateToken = require('../model/ActivateToken');
const crypto = require('crypto');
const { sendConfirmationEmail } = require('../middleware/mailer')

const handleResendVerification = async (req, res) => {
    const { user } = req.body;
    if (!user ) return res.status(400).json({ 'message': 'Please enter an email!' });
    User.findOne({ username: user }).then(function (doc) {
        if (!doc){
            return res.status(500).send({msg:err.message});
        }

        const newtoken = crypto.randomBytes(16).toString('hex')
        console.log(newtoken)
        const newDate = Date.now() + 7200000 
        console.log(newDate)

        ActivateToken.updateOne( {_userId: doc._id},{$set: {
             "token": newtoken, "expireAt": newDate }
        },  function(error){
            if (error){
                return res.status(500).send({msg:err.message});
            } else {
                sendConfirmationEmail( {toUser: doc.username, userId:doc._id, hash: newtoken })
                res.status(201).json({ 'message': 'Please check your email to activate!' });
            }
        })
    })
}

module.exports = { handleResendVerification };