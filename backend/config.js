require("dotenv").config();

module.exports = {
  mongo_connection_string: process.env.MONGO_CONNECTION_STRING || "XXXXX",
  jwt_secret: process.env.JWT_SECRET || "abcdefghijklmnopqrstuvwxyz",
  jwt_cookie_expires_in: process.env.JWT_COOKIE_EXPIRES_IN || "86400000",
  jwt_token_expires_in: process.env.JWT_TOKEN_EXPIRES_IN || "24h",
  log_level: process.env.LOG_LEVEL || "info",
  aws_id: process.env.AWS_ID,
  aws_secret_key: process.env.AWS_SECRET_KEY,
  aws_region: process.env.AWS_REGION || "ap-south-1",
  google_client_id: process.env.CLIENT_ID || "XXXXXXXXX",
  google_client_secret: process.env.CLIENT_SECRET || "XXXXXXXXX",
  port: process.env.PORT || "3000",
  moss_server : 'moss.stanford.edu',
  moss_port : 7690,
  moss_no_request : 'Request not sent.',
  moss_user_id: process.env.MOSS_USER_ID || "57693921",
};