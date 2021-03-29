const octokit = require('./octokit');

const testWorkflow = async () => {
  const workflows = await octokit.actions.listWorkflowRuns({
    owner: 'jkubeio',
    repo: 'ci',
    workflow_id: 'e2e.yml'
  });
  console.log(workflows);
};

const testComment = async () => {
  const comment = await require('./comments').getReportComment();
  console.log(comment);
};

// Hacky way to remove warning
console.log(testWorkflow);

testComment().then(() => process.exit(0));
