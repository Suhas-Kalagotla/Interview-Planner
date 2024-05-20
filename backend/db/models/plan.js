// Run plagiarism request
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

var planSchema = new mongoose.Schema(
    {
        name: String,
        data: {},
        duration: Number,
        numberOfDays: Number,
        companies: [String],
        pace: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'muser' },
    },
    { timestamps: true },
);

planSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('plan', planSchema);
