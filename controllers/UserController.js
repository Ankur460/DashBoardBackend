import userModel from '../models/User.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import transporter from '../config/emailConfig.js'
class UserController {
  static userRegistration = async (req, res) => {
    const { name, email, age, gender, password, password_confirmation
      , tc } = req.body;
    const user = await userModel.findOne({ email: email });
    
    if (user) {
      res.send({
        "status": "failed",
        "message": "Email already Exist"
      })
    } else {
      if (name && email && age && gender && password && password_confirmation
        && tc) {

        if (password === password_confirmation
        ) {
          try {
            // const salt= await bcrypt.genSalt(10);
            // const hashPassword=await bcrypt.hash(password,salt); 
            const doc = new userModel({
              name: name,
              email: email,
              age: age,
              gender: gender,
              password: password,
              tc: tc
            })
            await doc.save();
            const savedUser = userModel.findOne({ email: email });
            //Generate Token
            const token = jwt.sign({ userID: savedUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' })
            res.json({
              status: "Success",
              message: "User registred",
              token: token
            })

          } catch (error) {
            res.send({
              "status": "failed",
              "message": error.message
            })
          }

        } else {
          res.send({
            "status": "failed",
            "message": "password and confirm password dose not matched"
          })
        }

      } else {
        res.send({
          "status": "failed",
          "message": "All Fields are required"
        })
      }
    }

  }

  static userLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (email && password) {
        //checking email exist or not
        const user = await userModel.findOne({ email: email });
       
        if (user) {

          if (user.email === email && password == user.password) {
            //Generate Token
            const token = jwt.sign({ userID: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '5d' });
            res.json({
              "status": "Success",
              "message": "login successfull",
              "user": user,
              token: token
            })
          } else {
            res.send({
              "status": "failed",
              "message": "user email or password dose not matched"
            })
          }
        } else {
          res.send({
            "status": "failed",
            "message": "user not found"
          })
        }
      } else {
        res.send({
          "status": "failed",
          "message": "All Fields are required"
        })
      }
    } catch (error) {
      res.send({
        "status": "failed",
        "message": error.message
      })
    }
  }

  static changeUserPassword = async (req, res) => {
    const { password, password_confirmation
    } = req.body
    if (password && password_confirmation
    ) {
      if (password !== password_confirmation
      ) {
        res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
      } else {


        await userModel.findByIdAndUpdate(req.user._id, { $set: { password: password } })
        res.send({ "status": "success", "message": "Password changed succesfully" })
      }
    } else {
      res.send({ "status": "failed", "message": "All Fields are Required" })
    }
  }

  static loggedUser = async (req, res) => {
    res.send({ "user": req.user })
  }

  static sendUserPasswordResetEmail = async (req, res) => {
    const { email } = req.body
    if (email) {
      const user = await userModel.findOne({ email: email })
      
      if (user) {
        const secret = user._id + process.env.JWT_SECRET_KEY
        const token = jwt.sign({ userID: user._id }, secret, { expiresIn: '15m' })
        const link = `http://127.0.0.1:3000/api/user/reset/${user._id}/${token}`
        console.log(link)
        // Send Email
        const mailOptions = {
          from: 'ankurrai460@gmail.com',
          to: '2000520310013@ietlucknow.ac.in',
          subject: 'Hello from Nodemailer',
          html: `<a href=${link}>Click Here</a> to Reset Your Password`
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            res.send({ "status": "failed", "message": error.message })
          } else {
            res.send({ "status": "success", "message": "Password Reset Email Sent... Please Check Your Email" })
          }
        });

       
      } else {
        res.send({ "status": "failed", "message": "Email doesn't exists" })
      }
    } else {
      res.send({ "status": "failed", "message": "Email Field is Required" })
    }
  }

  static userPasswordReset = async (req, res) => {
    const { password, password_confirmation
    } = req.body
    const { id, token } = req.params
    const user = await userModel.findById(id)
    const new_secret = user._id + process.env.JWT_SECRET_KEY
    try {
      jwt.verify(token, new_secret)
      if (password && password_confirmation) {

        if (password !== password_confirmation) {
          res.send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
        } else {

          await userModel.findByIdAndUpdate(user._id, { $set: { password: password } })
          res.send({ "status": "success", "message": "Password Reset Successfully" })
        }
      } else {
        res.send({ "status": "failed", "message": "All Fields are Required" })
      }
    } catch (error) {
      res.send({ "status": "failed", "message": "Invalid Token" })
    }
  }
}
export default UserController;