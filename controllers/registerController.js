const User = require('../model/User');
const ActivateToken = require('../model/ActivateToken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const { sendConfirmationEmail } = require('../middleware/mailer')

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) return res.status(400).json({ 'message': 'Username already taken!' }); //Conflict 

    try {
        //encrypt the password
        const saltRounds = 10;
        const token = crypto.randomBytes(16).toString('hex')

        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(pwd, salt, function(err, hashedPwd) {
                
                //create and store the new user
                newUser = new User({
                    "username": user,
                    "password": hashedPwd
                });
                newUser.save( function(err, newUser){

                    actToken = new ActivateToken({
                        "_userId": newUser._id,
                        "token": token
                    })
                    actToken.save()

                    //spinning wheel here
                    sendConfirmationEmail( {toUser: user, userId: newUser._id , hash: token })
                })
            });
        });

        res.status(201).json({ 'Success': `New account created for ${user}! Please check your email to activate! ` });
    
    } catch (err) {

        res.status(500).json({ 'Message': err.message });
    }
}

module.exports = { handleNewUser };