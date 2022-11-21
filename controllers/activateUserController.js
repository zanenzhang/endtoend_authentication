const User = require('../model/User');
const ActivateToken = require('../model/ActivateToken');
const { sendVerifiedEmail } = require('../middleware/mailer')
const alert = require('alert'); 

const handleUserActivation = async (req, res) => {
    
      const userId = req.params.user;
      const hash = req.params.hash;
  
      if (!hash) {
        return res.status(401).json({message: 'The user cannot be validated!'})
      }
  
      ActivateToken.findOne({ token: hash }, function (err, token) {
        // token is not found into database i.e. token may have expired 
        if (!token){
            return res.status(400).send({msg:'Your verification link may have expired. Please click resend to get a new verification link!'});
        }
        // if token is found then check valid user 
        else{
  
            User.findOne({ _id: userId }, function (err, user) {
                // not valid user
                if (!user){
                    return res.status(401).send({msg:'We were unable to find a user for this verification. Please register!'});
                } 
                // user is already verified
                else if (user.active){
                    return res.status(200).send('User has been already verified. Please Login');
                }
                // verify user
                else{
                    // change isVerified to true
                    user.active = true;
                    user.save(function (err) {
                        // error occur
                        if(err){
                            return res.status(500).send({msg: err.message});
                        }
                        // account successfully verified
                        else{
                          sendVerifiedEmail({ toUser: user.username })
                          alert("Verified! Your account is now active!"); 
                          ActivateToken.deleteOne( { _userId : userId} )
                                                
                          return res.redirect('http://localhost:3000/login');
                        }
                    });
                }
            });
        }
        
    });
  };

module.exports = { handleUserActivation };
  