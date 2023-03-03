const mongoose = require('mongoose');
const { Schema } = mongoose;

const reactionSchema = new Schema({
  type: {
    type: String,
    enum: ['like', 'love', 'wow', 'sad', 'angry'],
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
});

const commentSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  }
});

const postSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  images: {
    type: [String],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reactions: [reactionSchema],
  comments: [commentSchema]
}, {
  timestamps: true
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;

