const { runMossPlagiarism } = require('../mossLib/mossController');

//TODO : pass data to runMossPlagiarism to run plagiarism
module.exports.runPlagiarism = async (req, res) => {
    try {
        let result = await runMossPlagiarism([]);
        res.json({ success: result });
    } catch (error) {
        logger.error("Error in runPlagiarism", error);
        return res.status(400).json({
            status: 'error',
            message: 'Something went wrong',
        });
    }
};
