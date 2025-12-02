import mongoose from "mongoose";

 const connectDB=async()=>{
    try{

        await mongoose.connect("mongodb+srv://suchethanreddykarra_db_user:AH88mAwwT76OjgAr@cluster0.sktwuvl.mongodb.net/MyLearningDB")
        console.log("connection successful");

    }
    catch(err){
        console.log("connection failed", err.message)

    }
}

export default connectDB;


// const mongoose = require("mongoose");

// mongoose.connect("mongodb+srv://suchethanreddykarra_db_user:AH88mAwwT76OjgAr@cluster0.sktwuvl.mongodb.net/myLearningDB")
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log(err));

// const UserSchema = new mongoose.Schema({
//   name: String,
//   age: Number,
//   role: String
// });

// const User = mongoose.model("User", UserSchema);

// async function addUser() {
//   const newUser = new User({
//     name: "Suchethan",
//     age: 22,
//     role: "Developer"
//   });

//   const savedUser = await newUser.save();
//   console.log("Saved:", savedUser);
// }

// addUser();
