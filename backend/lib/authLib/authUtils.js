/**
 * contains all utility functions to implement authorization mechanisms in authController.js file
 */
const jwt = require('jsonwebtoken');
const config = require('../../config');
const logger = require('../../utils/logger').getLogger();

const signToken = (id, role, profilePicture, firstName) => {
    return jwt.sign({ id, role, profilePicture, firstName }, config.jwt_secret, {
        expiresIn: config.jwt_token_expires_in,
    });
};

module.exports.createSendToken = async (
    user,
    statusCode,
    res,
    firstLogin = false,
    consoleLogin = false,
) => {
    try {
        const user_role = 'client';

        // if data is found on user_role_map table get role and generate token
        if (user_role) {
            const token = signToken(user.id, user_role, user.avatar, user.firstName);

            console.log("TOKEN",token);

            const cookieOptions = {
                maxAge: config.jwt_cookie_expires_in,
                httpOnly: true,
            };

            if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

            res.cookie('jwt', token, cookieOptions);

            user.password = undefined;
            user.tokens = undefined;

            res.status(statusCode).json({
                status: 'success',
                token,
                firstLogin,
                consoleLogin: consoleLogin ? true : undefined,
                data: { user },
            });
        } else {
            logger.error(`Record not found for user = ${user?.userName} on user role map`);
            res.status(500).json({
                status: 'ERROR',
                message: 'Data not found on user role map',
            });
        }
    } catch (error) {
        logger.error('ERROR In createSendTokenSql', error);
        res.status(500).json({
            status: 'error',
            message: error.message,
        });
    }
};
