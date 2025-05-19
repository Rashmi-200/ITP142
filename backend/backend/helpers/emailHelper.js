import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'dileesharanadewa2002@gmail.com',
        pass: 'lreh xwew bbjb kdky'
    }
});

const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: 'dileesharanadewa2002@gmail.com',
            to,
            subject,
            html
        });
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export { sendEmail };
