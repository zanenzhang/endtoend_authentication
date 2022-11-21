const User = require('../model/User');
const ResetPassToken = require('../model/ResetPassToken');
const { sendPassResetConfirmation } = require('../middleware/mailer');
const bcrypt = require('bcrypt');

const handleInputNewPassword = async (req, res) => {
    
    const { userId, hash, pwd } = req.body

    const saltRounds = 10;

    if (!hash) {
        return res.status(401).json({message: 'The user cannot be validated!'})
      }

    User.findOne({_id: userId}, function(err, foundUser){
        if (!foundUser){
            return res.status(400).send({msg:'The user cannot be validated!'});
        }

        ResetPassToken.findOne({ token: hash, _userId: userId }, function (err, foundToken) {
            // token is not found into database i.e. token may have expired 
            if (!foundToken){
                return res.status(400).send({msg:'Your reset password link may have expired. Please reclick to get a new reset link!'});
            }
            // if token is found then check valid user 
            else{

                bcrypt.genSalt(saltRounds, function(err, salt) {

                    bcrypt.hash(pwd, salt, function(err, hashedPwd) {

                        foundUser.password = hashedPwd

                        foundUser.save( function(error) {
                            if (error){
                                return res.status(500).send({msg:err.message});
                            } 
                            console.log(foundUser)

                            sendPassResetConfirmation({toUser: foundUser.username})
                            
                            return res.status(200).send({msg:'Your password has been reset!'});
                        })
                        
                    })
                })
            }
        })
      
    })

}
     
module.exports = { handleInputNewPassword };
  

