import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email:String,
  password:String,
  phoneNumber:String,
  role: String
});
const user=mongoose.model("User",UserSchema);

export default user;