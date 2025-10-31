// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    // Google OAuth fields
    googleId: {
        type: String,
        unique: true,
        sparse: true, // Allows null values while maintaining uniqueness
    },
    photoURL: {
        type: String,
        default: '',
    },
    // Premium status
    isPremium: {
        type: Boolean,
        default: false,
    },
    // Pomodoro settings
    settings: {
        focus: { type: Number, default: 25 },
        shortBreak: { type: Number, default: 5 },
        longBreak: { type: Number, default: 15 },
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);