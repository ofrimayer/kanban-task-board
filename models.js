import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  user: String,
  password: String,
  mode: { type: String, enum: ['light', 'dark'] }
});

const cardSchema = new mongoose.Schema({
  title: String,
  desc: String,
  color: String,
  index: Number
});

const noteSchema = new mongoose.Schema({
  username: String,
  todo: [cardSchema],
  done: [cardSchema],
  doing: [cardSchema]
});

const User = mongoose.model('User', userSchema);
const Note = mongoose.model('Note', noteSchema);

export { User, Note };
