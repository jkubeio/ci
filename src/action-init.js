const comments = require('./comments');
const report = require('./report');
const workflows = require('./workflows');

const abortPrevious = async () => {
  const previousReportComment = await comments.getReportComment();
  if (!previousReportComment) {
    return;
  }
  console.log('Aborting previous run');
  const metadata = report.parseMetadata(previousReportComment);
  await workflows.cancelWorkflowRun(metadata.runId);
};

const actionInit = async () => {
  const initActions = [abortPrevious, comments.updateReportComment];
  for (const func of initActions) {
    await func();
  }
};

module.exports = actionInit;
