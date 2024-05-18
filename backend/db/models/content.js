const mongoose = require('mongoose');

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

var contentSchema = new mongoose.Schema(
    {
        title: String,
        username: String,
        data: { type: String, required: true },
        language: {
            type: String,
            required: true,
            enum: MOSS_LANGUAGES,
            default: MOSS_LANGUAGES_MAP.CC,
        },
        request_id: { type: mongoose.Schema.Types.ObjectId, ref: 'request' },
    },
    { timestamps: true },
);

module.exports = mongoose.model('content', contentSchema);
