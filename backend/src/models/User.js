import { Schema, model } from "mongoose";
import bcrypt from 'bcryptjs'

const userSchema = new Schema({
  nickname: {
    type: String,
    unique: true
  },
  email: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  favoriteCharacters: [Number],
}, {
  timestamps: true,
})

userSchema.statics.encryptPassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  return await bcrypt.hash(password, salt)
}

userSchema.statics.comparePassword = async (receivedPassword, password) => {
  return await bcrypt.compare(receivedPassword, password)
}

export default model('User', userSchema)