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

const checkOutPRBranch = async () => {
  console.log(`Checking out JKube repository for PR...`);
  await pullRequests.checkOut();
  try {
    console.log(`Installing JKube project from PR...`);
    child_process.execSync(`mvn -f jkube/pom.xml -B -DskipTests clean install`, {
      stdio: 'inherit'
    });
  } catch (error) {
    throw new Error(`Problem executing Maven Install for JKube:\n${err.status}: ${err.message}`);
  }
};

const actionInit = async () => {
  const initActions = [abortPrevious, comments.updateReportComment, checkOutPRBranch];
  for (const func of initActions) {
    await func();
  }
};

module.exports = actionInit;
