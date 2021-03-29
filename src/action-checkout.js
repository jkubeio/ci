const child_process = require('child_process');
const config = require('./config');
const pullRequests = require('./pull-requests');

const checkOutPRBranch = async () => {
  console.log(`Checking out JKube repository for PR...`);
  await pullRequests.checkOut();
  try {
    console.log(`Installing JKube project from PR...`);
    child_process.execSync(`mvn -f jkube/pom.xml -B -DskipTests clean install`, {
      stdio: 'inherit'
    });
  } catch (error) {
    throw new Error(`Problem executing Maven Install for JKube:\n${err.status}: ${err.message}`);
  }
};

const checkOutITRepo = async () => {
  console.log(`Checking out JKube IT (${config.itRepoGit} repository (${config.itRevision})...`);
  try {
    child_process.execSync(`git clone ${config.itRepoGit} --branch ${config.itRevision} jkube-it`, {
      stdio: 'inherit'
    });
  } catch (error) {
    throw new Error(`Couldn't check out JKube IT repository:\n${err.status}: ${err.message}`);
  }
};

const actionCheckout = async () => {
  for (const func of [checkOutPRBranch, checkOutITRepo]) {
    await func();
  }
};

module.exports = actionCheckout;
