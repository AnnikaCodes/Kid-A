'use strict';

const redis = require('thunk-redis');
const fs = require('fs');

let tables;

try {
	tables = require('./data/tables.json');
} catch (e) {}

if (!Array.isArray(tables)) tables = [];

function writeTables() {
	fs.writeFileSync('./data/tables.json', JSON.stringify(tables));
}

module.exports = {
	databases: {},
	tables: tables,

	useDatabase(name) {
		if (this.databases[name]) return this.databases[name];

		let i = this.tables.indexOf(name);
		if (i === -1) {
			i = this.tables.length;
			this.tables.push(name);
			writeTables();
		}

		let client = redis.createClient({database: i, usePromise: true});
		this.databases[name] = client;
		return client;
	},
};

