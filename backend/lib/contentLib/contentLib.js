const { runMossPlagiarism } = require('../mossLib/mossController');
const logger = require('../../utils/logger').getLogger();
const planModal = require('../../db/models/plan');
const problemModel = require('../../db/models/problem');
const contentModal = require('../../db/models/content');
const { mongo } = require('mongoose');

/**
 * Uploads documents for plagiarism checking using MOSS (Measure of Software Similarity).
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 */
module.exports.upload_doc = async (req, res) => {
    try {
        // Extracting list of code snippets from request body
        const listOfCode = req.body.jsonData;
        logger.debug('Request body in upload_doc: ', req.body);
        let CODE_ARRAY = [];

        // Parsing each code snippet and preparing data structure for MOSS
        for (let row of listOfCode) {
            let temp = {
                id: row?.filename,
                code: row?.code,
                username: row?.username,
            };

            CODE_ARRAY.push(temp);
        }

        let new_request = requestModal({
            data: CODE_ARRAY,
            user: req.user.id,
            language: req?.body?.language,
        });

        await new_request.save();

        for (let single_code of CODE_ARRAY) {
            let new_content = await contentModal({
                title: single_code.id,
                username: single_code.username,
                data: single_code.code,
                language: req?.body?.language,
                request_id: new_request._id,
            });
            await new_content.save();
        }

        // Running plagiarism check using MOSS
        let result = await runMossPlagiarism(CODE_ARRAY, req?.body?.language);
        // let result = 'done ';

        // update the request table with result url
        await requestModal.updateOne({_id: new_request._id}, { resultUrl : result });

        // Sending successful response with result
        res.status(201).json({ message: 'Content saved successfully', result });
    } catch (error) {
        // Handling errors
        console.error('Error saving content:', error);
        logger.error('Error saving content:', error); // Logging error
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports.generate_plan = async (req, res) => {
     // Extracting list of code snippets from request body

     console.log(req.body);


     let data = await problemModel.find();

     const newPlan = new planModal({
        name : req.body.planName,
        data,
        duration : req.body.duration,
        numberOfDays : req.body.numberOfDays,
        companies : req.body.companies,
        user : req.user.id,
     })

     let savePlan = await newPlan.save();

     res.status(201).json({ message: 'Content saved successfully' , savePlan});
}


module.exports.get_report_list = async (req, res) => {
    try {

        const query = { limit: req.query.limit, page: req.query.page };
        const mongo_query = { user : req.user.id }
        const report_list = await planModal.paginate( mongo_query, query);

        res.status(200).json({ message: "result", data : report_list});
    } catch (error) {
        // Handling errors
        console.error('Error saving content:', error);
        logger.error('Error saving content:', error); // Logging error
        res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports.get_plan = async (req, res) => {
    try {

        const plan = await planModal.findById(req.params.id);

        res.status(200).json({ message: "result", data : plan});
    } catch (error) {
        logger.error('Error fetching content:', error); // Logging error
        res.status(500).json({ message: 'Internal server error' });
    }
};