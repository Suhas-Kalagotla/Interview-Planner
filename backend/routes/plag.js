const express = require('express');
const plagiarism_router = express.Router();
var content_lib = require('../lib/contentLib/contentLib');
const { protect } = require('../middleware/auth');

plagiarism_router.post("/run", protect,content_lib.upload_doc);
plagiarism_router.get('/report', protect, content_lib.get_report_list);

module.exports = plagiarism_router;
