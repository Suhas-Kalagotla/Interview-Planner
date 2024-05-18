const mongoose = require('mongoose');

const IMPORTANCE = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9,
    ten: 10,
};

var chatSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'muser' },
        name: String,
        source: String,
        topic: String,
        importance: { type: Number, required: true, enum: IMPORTANCE, default: IMPORTANCE.one },
        timeToSolve: String,
        companies: [String],
        rank: Number,
    },
    { timestamps: true },
);

module.exports = mongoose.model('chat', chatSchema);
