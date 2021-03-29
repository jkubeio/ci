const child_process = require('child_process');
const config = require('./config');
const octokit = require('./octokit');

const get = async () => {
  const pr = await octokit.pulls.get({
    owner: config.owner,
    repo: config.repo,
    pull_number: config.pr
  });
  return pr.data;
};

const checkOut = async () => {
  const pr = await get();
  try {
    child_process.execSync(`git clone ${pr.head.repo.git_url} --branch ${pr.head.ref} jkube`, {
      stdio: 'inherit'
    });
  } catch (error) {
    throw new Error(`Couldn't check out #${config.pr}:\n${err.status}: ${err.message}`);
  }
};

module.exports = {
  checkOut,
  get
};
