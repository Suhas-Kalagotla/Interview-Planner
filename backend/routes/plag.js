const express = require('express');
const plagiarism_router = express.Router();
var content_lib = require('../lib/contentLib/contentLib');
const { protect } = require('../middleware/auth');


plagiarism_router.post("/run", protect, content_lib.upload_doc);
plagiarism_router.post("/plan", protect, content_lib.generate_plan);
plagiarism_router.get("/report", protect, content_lib.get_report_list);
plagiarism_router.get("/:id", protect, content_lib.get_plan)
plagiarism_router.get('/problems', protect, content_lib.get_all_problems);

module.exports = plagiarism_router;
