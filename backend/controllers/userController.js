import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import cardModel from "../models/cardModel.js";

// import fs from "fs";


// login
const loginuser = async (req, res) => {
  const {email, password} = req.body;

  console.log("Login request received");

  try{
    const user = await userModel.findOne({email});
    if(!user){
      return res.json({success: false, message: "User doesn't exist"});
    }

    const isMatch = await bcrypt.compare(password,user.password);

    if(!isMatch){
      return res.json({success: false, message: "Invalid credentials"});
    }

    const token = createToken(user._id);
    res.json({success: true, token, name: user.name, userId: user._id});

  } catch(error){
    console.log(error);
    res.json({success: false, message: "Error"});
  }
}

const createToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET);
}

const adduser = async (req, res) => {
  const {name, password, email, studyStreak, totalCardsStudied, lastStudyDate} = req.body;
  try {
    const exists = await userModel.findOne({email})
    if(exists){
      return res.json({success: false, message: "User already exists"})
    }

    if(!validator.isEmail(email)){
      return res.json({success: false, message: "Please enter a valid email"});
    }

    if(password.length < 8){
      return res.json({success: false, message: "Please enter a strong password"});
    }

    // hashing user password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name: name,
      email: email,
      password: hashedPassword,
      studyStreak: studyStreak,
      totalCardsStudied: totalCardsStudied,
      lastStudyDate: lastStudyDate,
    })

    const user = await newUser.save();
    console.log("User created successfully", user._id);
    // await cardModel.create({
    //   userId: user._id,
    //   cards: [],
    //   totalCards: 0,
    //   reviewCards: 0,
    //   deckId: null,
    //   userId: user._id,

    // })
    console.log("Card model created");
    const token = createToken(user._id);
    res.json({success: true, token, name: name, userId: user._id})
  } catch (error) {
    console.log("Error in catch: ", error);
    res.json({success: false, message: "Error in catch block"})
  }
}

export { adduser, loginuser };