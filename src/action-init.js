const child_process = require('child_process');
const comments = require('./comments');
const config = require('./config');
const pullRequests = require('./pull-requests');
const report = require('./report');
const workflows = require('./workflows');

const abortPrevious = async () => {
  const previousReportComment = await comments.getReportComment();
  if (!previousReportComment) {
    return;
  }
  console.log(`Found previous CI execution (#${config.pr})`);
  const metadata = report.parseMetadata(previousReportComment);
  if (metadata && metadata.runId) {
    console.log(`Checking previous run for #${config.pr} - ${metadata.runId}`);
    const previousRun = await workflows.get(metadata.runId);
    if (previousRun && previousRun.status !== 'completed') {
      try {
        console.log(`Aborting previous run: ${metadata.runId} (${previousRun.status})`);
        await workflows.cancelWorkflowRun(metadata.runId);
      } catch (err) {
        console.log(`Couldn't abort previous job: ${err}`);
      }
    }
  }
};

const actionInit = async () => {
  const initActions = [abortPrevious, comments.updateReportComment];
  for (const func of initActions) {
    await func();
  }
};

module.exports = actionInit;
