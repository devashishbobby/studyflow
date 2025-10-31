const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
    },
    title: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },
    // --- NEW FIELDS ---
    subject: {
      type: String,
      default: 'General', // A default category if the user doesn't provide one
    },
    timeSpent: {
      type: Number, // We will store this in minutes
      default: 0,
    },
  },
  {
    timestamps: true, // This automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model('task', TaskSchema);
