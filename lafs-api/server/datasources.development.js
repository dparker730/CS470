module.exports = {
  mongodb: {
    connector: 'mongodb',
    hostname: process.env.DB_HOST || 'localhost', // default to 'localhost' if not specified
    port: process.env.DB_PORT || 27017, // default to 27017 if not specified
    user: process.env.DB_USER || '', // default to empty if not specified
    password: process.env.DB_PASSWORD || '', // default to empty if not specified
    database: process.env.DB_NAME || 'lafs', // default to 'lafs' if not specified
    url: process.env.DB_URL // no default value, it's assumed to be provided by environment
  }
};
