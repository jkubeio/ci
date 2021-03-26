const {Octokit} = require('@octokit/rest');
const config = require('./config');

module.exports = new Octokit({
  auth: config.auth
});
