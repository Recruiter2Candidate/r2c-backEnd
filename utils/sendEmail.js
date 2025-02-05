
const nodemailer = require('nodemailer');

const sendEmail = async (subject, message, send_to, sent_from, reply_to) => {
  const transporter = nodemailer.createTransport({
   service: process.env.SERVICE,
   port: 587,
   auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
   },

   tls: {
      rejectUnauthorized: false
   }
    
  });

  
  const options = {
    from: sent_from, 
    to: send_to,
    reply: reply_to,
    subject: subject,
    html: message, 
  };

  
  transporter.sendMail(options, function(err, info){
    if(err){
    console.log(err)
    }

    console.log(info)

  })
 

}

module.exports = sendEmail;
