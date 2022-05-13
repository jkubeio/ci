// noinspection JSUnusedLocalSymbols

const comments = require('../src/comments');
const config = require('../src/config');
const octokit = require('../src/octokit');
const pullRequests = require('../src/pull-requests');
const workflows = require('../src/workflows');

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
  const comment = await comments.getReportComment();
  console.log(comment);
};

const testPR = async () => {
  const pr = await pullRequests.get();
  console.log(pr);
};

const testJobs = async () => {
  const jobs = await workflows.jobs();
  console.log(jobs);
};

const testArtifacts = async () => {
  const artifacts = await workflows.artifacts();
  if (artifacts.total_count > 0) {
    const artifactDownload = await workflows.artifactDownload(artifacts.artifacts[0]);
    console.log(artifactDownload);
  }
}

const testUpdateReportComment = async () => {
  // IF TESTING STUFF; MAKE SURE TO DISABLE THE LAST LINE WHERE THE COMMENT IS ACTUALLY UPDATED
  await comments.updateReportComment(true);
}
testUpdateReportComment().then(() => process.exit(0));
