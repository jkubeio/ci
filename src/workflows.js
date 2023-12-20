const AdmZip = require('adm-zip');
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

const jobs = async () => {
  const ret = await octokit.actions.listJobsForWorkflowRun({
    owner: config.ciOwner,
    repo: config.ciRepo,
    run_id: parseInt(config.runId, 10)
  });
  return ret.data;
};

const artifacts = async () => {
  const ret = await octokit.actions.listWorkflowRunArtifacts({
    owner: config.ciOwner,
    repo: config.ciRepo,
    run_id: parseInt(config.runId, 10)
  });
  return ret.data;
};

const artifactDownload = async (artifact) => {
  const ret = await octokit.actions.downloadArtifact({
    owner: config.ciOwner,
    repo: config.ciRepo,
    artifact_id: artifact.id,
    archive_format: 'zip'
  });
  const zip = new AdmZip(Buffer.from(ret.data));
  const zipEntry = zip.getEntries().find((e) => e.entryName === 'jkube-test-report.txt');
  return zipEntry ? zipEntry.getData().toString('utf8') : '';
};

module.exports = {
  artifacts,
  artifactDownload,
  cancelWorkflowRun,
  get,
  getWorkflowRun,
  jobs
};
