const net = require('net');
const { ALLOWED_LANGUAGES } = require('./utils');
const config = require('../../config');
const logger = require("../../utils/logger").getLoggerByName("MOSS CONTROLLER");

// Moss options
let opt_m = 10;    // default maximum matches
let opt_d = 0;     // default directory mode
let opt_x = 0;     // default experimental mode
let opt_c = '';    // default comment
let opt_n = 250;   // default result limit
let bindex = 0;    // index for additional files

/**
 * Creates a new socket
 */
function createSocket() {
    const sock = new net.Socket();

    sock.on('close', () => {
        logger.info('Connection closed.');
    });

    return sock;
}



/**
 * Reads data from the server
 * @param {net.Socket} sock - The socket to read data from
 * @returns {Promise<string>} - A promise that resolves with the server's response
 */
function readFromServer(sock) {
    return new Promise((resolve, reject) => {
        sock.on('data', (data) => {
            const msg = data.toString();
            // Log received data
            logger.debug("Received data:", msg);

            if(msg.includes("Error") || msg.includes("http")) {
                logger.error("Error in server response:", msg);
                resolve(msg);
            }
        });

        sock.on('end', (end) => {
            logger.debug("Connection ended:", end);
            resolve(end);
        });

        sock.on('error', (err) => {
            logger.error("Socket error:", err);
            reject(err);
        });
    });
}



/**
 * Uploads a file to the server
 * @param {net.Socket} sock - The socket to upload the file to
 * @param {object} file - The file object containing code and id
 * @param {number} id - The identifier for the file
 * @param {string} lang - The language of the file
 */
function uploadFile(sock, file, id, lang) {
    const size = Buffer.byteLength(file.code, 'utf8');

    logger.info(`Uploading ${file.id} ...`);
    sock.write(`file ${id} ${lang} ${size} ${file.id}\n`);

    sock.write(file.code);

    logger.info('Upload complete.');
}

/**
 * Connects to the Moss server
 * @returns {Promise<net.Socket>} - A promise that resolves with the connected socket
 */
async function connectToMossServer() {
    const sock = createSocket();

    return new Promise((resolve) => {
        sock.connect(config.moss_port, config.moss_server, () => {
            sock.setEncoding('utf8');
            logger.info('Connected to Moss server.');
            resolve(sock);
        });
    });
}



/**
 * Configures Moss options on the server
 * @param {net.Socket} sock - The socket to configure Moss options on
 * @returns {boolean} - Returns true if configuration is successful, false otherwise
 */
function configureMossOptions(sock, language) {
    sock.write(`moss ${config.moss_user_id}\n`);
    sock.write(`directory ${opt_d}\n`);
    sock.write(`X ${opt_x}\n`);
    sock.write(`maxmatches ${opt_m}\n`);
    sock.write(`show ${opt_n}\n`);

    if (!ALLOWED_LANGUAGES.includes(language)) {
        logger.error(`Unrecognized language ${language}.`);
        sock.write('end\n');
        sock.end();
        return false;
    }

    sock.write(`language ${language}\n`);

    sock.on('data', (data) => {
        const msg = data.toString().trim();
        if (msg === 'no') {
            logger.error(`Unrecognized language ${language}.`);
            sock.write('end\n');
            sock.end();
        }
    });

    return true;
}



/**
 * Runs a Moss query on the server
 * @param {net.Socket} sock - The socket to run the Moss query on
 * @returns {Promise<string>} - A promise that resolves with the server's response
 */
async function runMossQuery(sock, code_list, language) {
    let i = 0;
    while (i < bindex) {
        uploadFile(sock, opt_b[i++], 0, language);
    }

    let setid = 1;
    for (const file of code_list) {
        uploadFile(sock, file, setid++, language);
    }

    sock.write(`query 0 ${opt_c}\n`);
    logger.info("Query submitted. Waiting for the server's response.");

    let result = await readFromServer(sock);
    return result;
}



/**
 * Main function to run Moss plagiarism check
 * @returns {Promise<string>} - A promise that resolves with the server's response
 */
module.exports.runMossPlagiarism = async function(code_list, language) {
    const sock = await connectToMossServer();

    const mossConfigured = configureMossOptions(sock, language);
    if (!mossConfigured) {
        // Don't close the socket here if configuration fails
        return;
    }

    let result = await runMossQuery(sock, code_list, language);

    // Log the result
    logger.info(result);

    // Close the socket only if the query is completed successfully
    sock.write('end\n');
    sock.end();

    return result;
}
