// Run plagiarism request
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');


const MOSS_LANGUAGES = [
    'c',
    'cc',
    'java',
    'ml',
    'pascal',
    'ada',
    'lisp',
    'scheme',
    'haskell',
    'fortran',
    'ascii',
    'vhdl',
    'perl',
    'matlab',
    'python',
    'mips',
    'prolog',
    'spice',
    'vb',
    'csharp',
    'modula2',
    'a8086',
    'javascript',
    'plsql',
    'verilog',
];
const MOSS_LANGUAGES_MAP = {
    C: 'c',
    CC: 'cc',
    JAVA: 'java',
    PYTHON: 'python',
    JAVASCRIPT: 'javascript',
};

var requestSchema = new mongoose.Schema(
    {
        data: {},
        language: {
            type: String,
            required: true,
            enum: MOSS_LANGUAGES,
            default: MOSS_LANGUAGES_MAP.CC,
        },
        resultUrl: { type: String, required: false },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'muser' },
    },
    { timestamps: true },
);

requestSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('request', requestSchema);
