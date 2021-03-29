const config = require('./config');
const octokit = require('./octokit');

const cancelWorkflowRun = (runId) =>
  octokit.actions.cancelWorkflowRun({
    owner: config.ciOwner,
    repo: config.ciRepo,
    run_id: parseInt(runId, 10)
  });

const getWorkflowRun = async (runId) => {
  const workflow = await octokit.actions.getWorkflowRun({
    owner: config.ciOwner,
    repo: config.ciRepo,
    run_id: parseInt(runId, 10)
  });
  return workflow.data;
};

const get = () => getWorkflowRun(config.runId);

module.exports = {
  cancelWorkflowRun,
  getWorkflowRun,
  get
};
