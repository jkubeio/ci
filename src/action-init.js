const comments = require('./comments');
const config = require('./config');
const report = require('./report');
const workflows = require('./workflows');

const abortPrevious = async () => {
  const previousReportComment = await comments.getReportComment();
  if (!previousReportComment) {
    return;
  }
  console.log(`Found previous CI execution (#${config.pr}`);
  const metadata = report.parseMetadata(previousReportComment);
  if (metadata && metadata.runId) {
    console.log(`Aborting previous run: ${metadata.runId}`);
    await workflows.cancelWorkflowRun(metadata.runId);
  }
};

const actionInit = async () => {
  const initActions = [abortPrevious, comments.updateReportComment];
  for (const func of initActions) {
    await func();
  }
};

module.exports = actionInit;
