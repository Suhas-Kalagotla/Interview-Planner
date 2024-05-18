/* auth middleware file */
const config = require('../config');
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger").getLogger();


/**
 * Middleware to protect routes, validate access and refresh tokens,
 * and regenerate the access token if it has expired.
 *
 * @param {object} req - Express Request object
 * @param {object} res - Express Response object
 * @param {function} next - Next function to continue to the next middleware/route handler
 */
module.exports.protect = async (req, res, next) => {
    try {
        // Extract access token from request cookies
        const accessToken = req.cookies.jwt; // Assuming Bearer token format

        if (!accessToken) {
            logger.error("Access token missing");
            return res.status(401).json({ status: "TOKEN_EXPIRED", message: "Access token missing" });
        }

        try {
            // Verify and decode the access token
            const decoded = jwt.verify(accessToken, config.jwt_secret, { ignoreExpiration: true });

            logger.info("Decoded token", decoded);

            // Check if access token has expired
            if (decoded.exp < Date.now() / 1000) {
                logger.info("Access token has expired, check if refresh token is available");
                return res.status(440).json({ status: "LOGIN_TIME_OUT", message: "Login required" });
            }

            // Access token is valid, continue with the protected route
            req.user = { ...decoded, token: accessToken };
            console.log(req.user)
            return next();
        } catch (err) {
            logger.error("Invalid access token", err);
            return res.status(401).json({ status: "TOKEN_EXPIRED", message: "Invalid access token" });
        }
    } catch (err) {
        logger.error("ERROR IN protect middleware", err);
        return res.status(401).json({ status: "TOKEN_EXPIRED", message: err.message });
    }
};