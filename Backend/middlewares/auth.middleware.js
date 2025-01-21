const userModel = require('../models/user.model.js');
const blacklistTokenModel = require('../models/blacklistToken.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token ||  req.headers.authorization?.split(' ')[1];
  if(!token) {
    return res.status(401).json({message: 'Unauthorized'});
  }

  

  try {
//check if token is blacklisted
    const isBlacklisted = await blacklistTokenModel.findOne({token: token});

  if(isBlacklisted) {
    return res.status(401).json({message: 'Unauthorized: Token is blacklisted'});
  }

  //verify token and attach user to request 
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    req.user = user;
    return next();

  }catch (err) {
    return res.status(401).json({message: 'Unauthorized'});
  }
}