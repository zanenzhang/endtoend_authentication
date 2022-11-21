const User = require('../model/User');
const ResetPassToken = require('../model/ResetPassToken');
const crypto = require('crypto');
const alert = require('alert'); 
const { sendResetPasswordEmail } = require('../middleware/mailer')

const handleResetPassword = async (req, res) => {
    const { user } = req.body;
    if (!user ) return res.status(400).json({ 'message': 'Please enter an email!' });

    User.findOne({ username: user }).then(function (foundUser) {

        if (!foundUser){
            return res.status(500).send({msg:err.message});
        }
        
        ResetPassToken.findOne({ _userId: foundUser._id }).then(function (resetTok){

            const newToken = crypto.randomBytes(16).toString('hex')
            const newDate = Date.now() + 600000

            if (resetTok){

                ResetPassToken.updateOne( 
                    {_userId: foundUser._id},
                    {$set: {
                    "token": newToken, 
                    "expireAt": newDate }
                    },  function(error){
                        if (error){
                            return res.status(500).send({msg:err.message});
                        } else {
                            sendResetPasswordEmail( {toUser: foundUser.username, userId:foundUser._id, hash: newToken })
                            res.status(201).json({ 'message': 'Please check your email to reset your password!' });
                        }
                    })

            } else {

                const resetToken = new ResetPassToken({"_userId": foundUser.id, "token": newToken})
                resetToken.save( function(err){
                if (err) { 
                    return res.status(500).send({msg:err.message});
                  }
                })

                sendResetPasswordEmail( {toUser: foundUser.username, userId:foundUser._id, hash: newToken })
                alert("Please check your email for the password reset link!"); 
            }
        }) 
        }
    )
};

module.exports = { handleResetPassword };