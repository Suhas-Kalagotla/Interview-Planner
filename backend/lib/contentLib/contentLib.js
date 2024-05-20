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
        const { name, source, topic, importance, company, newSolve, solved, read } = req.body;
        logger.debug('Request body in upload_doc: ', req.body);
        const importanceMap = {
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
        const numericImportance = importanceMap[importance];

        const newProblem = new problem({
            user: req.user.id,
            name: name,
            topic: topic,
            source: source,
            companies: company,
            rank: 0,
            timeToSolve: {
                new: newSolve,
                solved: solved,
                read: read,
            },
            importance: numericImportance,
        });

        const saveProblem = await newProblem.save();
        return res.status(200).json({
            status: 'success',
            message: 'created problem new',
            data: saveProblem,
        });
    } catch (error) {
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


module.exports.get_all_problems = async (req, res) => {
    try {
        const query = { limit: req.query.limit, page: req.query.page };

        const mongo_query = { user: req.user.id };
        const problems_list = await problem.paginate(mongo_query, query);

        res.status(200).json({ message: 'Problems', data: problems_list });
    } catch (error) {
        console.error('Error saving content:', error);
        logger.error('Error saving content:', error);
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

