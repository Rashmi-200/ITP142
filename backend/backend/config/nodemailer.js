import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
      
      host: 'in-v3.mailjet.com',
      port: 587,
      secure:false,
      auth: {
        user:process.env.SMTP_USER,  //sender gmail address
        pass:process.env.SMTP_PASS,
      },
});

export default transporter;