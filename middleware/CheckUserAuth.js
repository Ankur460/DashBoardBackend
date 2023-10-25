import jwt from 'jsonwebtoken'
import UserModel from '../models/User.js'

var CheckUserAuth = async (req, res, next) => {
  let token
  const { authorization } = req.headers
  console.log(authorization);
  if (authorization && authorization.startsWith('Bearer')) {
    try {

      // Get Token from header
      token = authorization.split(' ')[1]
      
      // Verify Token
      const { userID } = jwt.verify(token, process.env.JWT_SECRET_KEY)

      // Get User from Token
      req.user = await UserModel.findById(userID).select('-password')

      next()
      
    } catch (error) {
      console.log(error)
      res.status(401).send({ "status": "failed", "message": "Unauthorized User" })
    }
  }
  if (!token) {
    res.status(401).send({ "status": "failed", "message": "Unauthorized User, No Token" })
  }
}

export default CheckUserAuth