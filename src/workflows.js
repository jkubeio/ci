const config = require('./config');
const octokit = require('./octokit');

const cancelWorkflowRun = (runId) =>
  octokit.actions.cancelWorkflowRun({
    owner: config.ciOwner,
    repo: config.ciRepo,
    run_id: runId
  });

const get = () =>
  octokit.actions.getWorkflowRun({
    owner: config.ciRepo,
    repo: config.ciOwner,
    run_id: config.runId
  });

module.exports = {
  cancelWorkflowRun,
  get
};
