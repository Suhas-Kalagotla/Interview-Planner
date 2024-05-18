/**
 * this file contains authentication strategies for login with Google and logout
 */
const { OAuth2Client } = require('google-auth-library');
const config = require('../../config');
const { createSendToken } = require('./authUtils');
const logger = require('../../utils/logger').getLogger();
const user_model = require('../../db/models/user');

/*
 * This is the function for google login
 * @param {string} tokenId - code from frontend
 * STEP 1 : GET THE tokenId FROM THE FRONTEND
 * STEP 2 : SEND THE CODE TO THE GOOGLE API WITH THE CLIENT ID TO GET THE USER PAYLOAD
 * STEP 3 : CHECK IF THE USER ALREADY EXISTS IN THE DATABASE
 * STEP 4 : IF THE USER EXISTS, CHECK IF THE USER IS REGISTERED WITH GOOGLE
 * STEP 5 : IF THE USER IS REGISTERED WITH GOOGLE, SEND THE TOKEN TO THE FRONTEND
 * STEP 6 : IF THE USER IS NOT REGISTERED WITH GOOGLE, SEND AN ERROR MESSAGE TO THE FRONTEND
 * STEP 7 : IF THE USER DOES NOT EXIST, CREATE A NEW USER IN THE DATABASE AND SEND THE TOKEN TO THE FRONTEND
 */

const client = new OAuth2Client(
    config.google_client_id,
    config.google_client_secret,
);

/*
 * SQL Version of the function for now
 */

module.exports.GoogleLoginSql = async (req, res) => {
    try {
        const { tokenId } = req.body;

        logger.info('Google login request received');

        const response = await client.verifyIdToken({
            idToken: tokenId,
            audience: config.google_client_id,
        });

        const { email_verified, name, email, picture } = response.getPayload();

        logger.debug(email_verified, name, email, picture);

        logger.info('Google login request verified');

        const query = { email };
        const user = await user_model.findOne(query);

        // if user already exists
        if (user) {
            logger.info('User already exists');
            createSendToken(user, 200, res);
        } else {
            // user does not exist
            logger.info('User does not exist, signup for access');

            const new_user = user_model({
                email: email,
                name: name,
                avatar: picture,
            });

            await new_user.save();
            createSendToken(user, 200, res);
        }
    } catch (error) {
        logger.error(error);
        return res.status(400).json({
            status: 'error',
            message: 'Something went wrong',
        });
    }
};

/*
 * This is the function for logout
 * @param {string} token - token from the frontend
 * STEP 1 : GET THE TOKEN FROM THE FRONTEND
 * STEP 2 : DELETE THE TOKEN FROM THE DATABASE
 * STEP 3 : SEND A SUCCESS MESSAGE TO THE FRONTEND
 */

module.exports.logout = async (req, res) => {
    try {
        const { token } = req.body;
        const userId = req.user.id;

        logger.info('Logout request received');
        logger.info('removing cookie...');

        for (let i of Object.keys(req.cookies)) {
            res.clearCookie(i);
        }
        // logger.info("Deleting token from cache")

        // myCache.del(userId)

        // logger.info("Token deleted from cache")

        return res.status(200).json({
            status: 'success',
            message: 'User logged out successfully',
        });
    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            status: 'error',
            message: 'Something went wrong',
        });
    }
};
