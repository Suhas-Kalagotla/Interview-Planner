const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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

var problemSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'muser' },
        name: String,
        source: String,
        topic: String,
        importance: { type: Number, required: true, enum: IMPORTANCE, default: IMPORTANCE.one },
        timeToSolve: {
            new: Number, // in minutes
            read: Number, // in minutes
            solved: Number, // in minutes
        },

        companies: [String],
        rank: Number,
    },
    { timestamps: true },
);

problemSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('problem', problemSchema);
