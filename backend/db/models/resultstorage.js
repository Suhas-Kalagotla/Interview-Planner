const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const ResultSchema = new mongoose.Schema(
    {
        request_id: { type: mongoose.Schema.Types.ObjectId, ref: 'request' },
        content_one_id: { type: mongoose.Schema.Types.ObjectId, ref: 'content' },
        content_two_id: { type: mongoose.Schema.Types.ObjectId, ref: 'content' },
        percentage_one_match: { type: Number, required: true },
        percentage_two_match: { type: Number, required: true },
        total_line_match: { type: Number, required: true },
    },
    { timestamps: true },
);

ResultSchema.plugin(mongoosePaginate);


module.exports = mongoose.model('Result', ResultSchema);
