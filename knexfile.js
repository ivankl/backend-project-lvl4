require('dotenv').config();

const path = require('path');

const migrations = {
  directory: path.resolve(__dirname, 'server', 'migrations'),
};

module.exports = {
    development: {
        client: 'sqlite3',
        connection: {
            filename: './database.sqlite',
        },
        useNullAsDefault: true,
        migrations,
    },
    test: {
        client: 'sqlite3',
        connection: ':memory',
        useNullAsDefault: true,
        migrations,
    },
};