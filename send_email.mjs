import nodemailer from 'nodemailer';


// Create a Nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'ankurrai460@gmail.com',
    pass: 'kwkw ntop xsai nbsx', // Use the App Password you generated in your Google Account
  }
});

// Email data
const mailOptions = {
  from: 'ankurrai460@gmail.com',
  to: '2000520310013@ietlucknow.ac.in',
  subject: 'Hello from Nodemailer',
  text: 'This is a test email sent using Nodemailer.'
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.log('Error sending email:', error);
  } else {
    console.log('Email sent:', info.response);
  }
});
