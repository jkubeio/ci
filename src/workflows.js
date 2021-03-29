const config = require('./config');
const octokit = require('./octokit');

const cancelWorkflowRun = (runId) =>
  octokit.actions.cancelWorkflowRun({
    owner: config.ciOwner,
    repo: config.ciRepo,
    run_id: parseInt(runId, 10)
  });

const get = async () =>
  await octokit.actions.getWorkflowRun({
    owner: config.ciOwner,
    repo: config.ciRepo,
    run_id: parseInt(config.runId, 10)
  }).data;

module.exports = {
  cancelWorkflowRun,
  get
};