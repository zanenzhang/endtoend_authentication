const nodemailer = require('nodemailer');

function sendEmail(message) {
  return new Promise((res, rej) => {

    const transporter = nodemailer.createTransport({
      host: "smtp.titan.email",
      port: 587,
      //secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    })

    transporter.sendMail(message, function(err, info) {
      if (err) {
        rej(err)
      } else {
        res(info)
      }
    })
  })
}

exports.sendConfirmationEmail = function({toUser, userId, hash}) {
  const message = {
    from: process.env.EMAIL_USER,
    // to: toUser.email // in production uncomment this
    to: toUser,
    subject: 'Plazamigo - Activate Account',
    html: `
      <h3> Hello! </h3>
      <p>Thank you for registering and welcome to ${process.env.MAIL_FROM_NAME}! Just one last step remaining...</p>
      <p>To activate your account please follow this link: <a target="_" href="${process.env.SERVER}/activate/${userId}/${hash}">${process.env.MAIL_FROM_NAME}/activate </a></p>
      <p>Cheers,</p>
      <p>The ${process.env.MAIL_FROM_NAME} team</p>
    `
  }

  return sendEmail(message);
}

exports.sendVerifiedEmail = function({toUser}) {
    const message = {
      from: process.env.EMAIL_USER,
      // to: toUser.email // in production uncomment this
      to: toUser,
      subject: 'Plazamigo - Account Verified',
      html: `
        <h3> Hello! </h3>
        <p>Thanks for verifying your account! Your account is now active!</p>
        <p>Cheers,</p>
        <p>The ${process.env.MAIL_FROM_NAME} team</p>
      `
    }
  
    return sendEmail(message);
  }

exports.sendResetPasswordEmail = ({toUser, userId, hash}) => {
  const message = {
    from: process.env.EMAIL_USER,
    // to: toUser.email // in production uncomment this
    to: toUser,
    subject: 'Plazamigo - Reset Password',
    html: `
      <h3>Hello!</h3>
      <p>To reset your password please follow this link: <a target="_" href="${process.env.CLIENT}/input-new-password?userId=${userId}&hash=${hash}">${process.env.MAIL_FROM_NAME}/input-new-password</a></p>
      <p>Cheers,</p>
      <p>The ${process.env.MAIL_FROM_NAME} team</p>
    `
  }

  return sendEmail(message);
}


exports.sendPassResetConfirmation = ({toUser}) => {
    const message = {
        from: process.env.EMAIL_USER,
        // to: toUser.email // in production uncomment this
        to: toUser,
        subject: 'Plazamigo - Password Was Reset!',
        html: `
          <h3>Hello!</h3>
          <p>This email is to notify that your password reset is complete. </p>
          <p>Cheers,</p>
          <p>The ${process.env.MAIL_FROM_NAME} team</p>
        `
      }

    return sendEmail(message);
}