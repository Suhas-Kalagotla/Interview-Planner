const { runMossPlagiarism } = require('../mossLib/mossController');
const logger = require('../../utils/logger').getLogger();
const requestModal = require('../../db/models/request');
const { mongo } = require('mongoose');
const problem = require('../../db/models/problem');
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

module.exports.get_report_list = async (req, res) => {
    try {
        const query = { limit: req.query.limit, page: req.query.page };
        const mongo_query = { user: req.user.id };
        console.log(query, mongo_query);
        const report_list = await requestModal.paginate(mongo_query, query);

        res.status(200).json({ message: 'result', data: report_list });
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
