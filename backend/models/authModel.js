const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./userModel");

async function createUser(email,password){
  const existingUser = await User.findOne({email});
  if(existingUser) throw new Error("User already exists");
  const hashedPassword = await bcrypt.hash(password,10);
  const user = new User({email,password:hashedPassword});
  await user.save();
  return user;
}

async function verifyUser(email,password){
  const user = await User.findOne({email});
  if(!user){
    throw new Error("Invalid email or password");
  }
  const isMatch = await bcrypt.compare(password,user.password);
  if(!isMatch){
    throw new Error("Invalid email or password");
  }
  return user;
}

function generateToken(user){
  return jwt.sign(
    {
      userId: user._id.toString()
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "24h"
    }
  );
}

module.exports = {createUser,verifyUser,generateToken};