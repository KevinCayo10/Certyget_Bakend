const { Storage } = require("@google-cloud/storage");
require("dotenv").config();

const storage = new Storage({
  projectId: process.env.PROJECT_ID,
  keyFilename: process.env.KEY_FILENAME,
});

module.exports = storage;
