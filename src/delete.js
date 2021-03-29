const config = require('./config');
const octokit = require('./octokit');
const workflows = require('./workflows');

const testWorkflow = async () => {
  const wfrl = await octokit.actions.listWorkflowRuns({
    owner: config.ciOwner,
    repo: config.ciRepo,
    workflow_id: 'e2e.yml'
  });
  console.log(wfrl);
  const workflow = await workflows.get();
  console.log(workflow);
};

const testComment = async () => {
  const comment = await require('./comments').getReportComment();
  console.log(comment);
};

const testPR = async () => {
  const pr = await require('./pull-requests').get();
  console.log(pr);
};

// Hacky way to remove warning
console.log(testWorkflow);
console.log(testComment);
console.log(testPR);

testPR().then(() => process.exit(0));
