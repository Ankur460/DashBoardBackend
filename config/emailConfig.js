
import nodemailer from 'nodemailer';


// Create a Nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'ankurrai460@gmail.com',
    pass: 'kwkw ntop xsai nbsx', // Use the App Password you generated in your Google Account
  }
});

export default transporter