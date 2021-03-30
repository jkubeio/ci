const comments = require('./comments');
const config = require('./config');
const report = require('./report');
const workflows = require('./workflows');

const shouldAbort = ({metadata, previousRun}) => {
  console.log(`Should abort: Status (${previousRun.status}), Run ID (${metadata.runId}), Current ID (${config.runId})`);
  return (
    parseInt(metadata.runId, 10) !== parseInt(config.runId, 10) && previousRun && previousRun.status !== 'completed'
  );
};

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
    if (shouldAbort({metadata, previousRun})) {
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
  console.log(`Bootstrapping CI workflow run ${config.runId} for #${config.pr}`);
  const initActions = [abortPrevious, comments.updateReportComment];
  for (const func of initActions) {
    await func();
  }
};

module.exports = actionInit;
