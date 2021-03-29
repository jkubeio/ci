const config = require('./config');
const octokit = require('./octokit');
const report = require('./report');
const workflow = require('./workflows');

const forIssue = async () => {
  if (!config.pr) {
    throw new Error(`Required argument --pr=$pullRequestNumber is missing`);
  }
  return octokit.issues.listComments({
    owner: config.owner,
    repo: config.repo,
    issue_number: config.pr
  });
};

const getReportComment = async () => {
  const reportComments = (await forIssue()).data
    .filter((c) => c.user.login === config.user)
    .filter((c) => c.body.indexOf(report.HEADER) === 0);
  return reportComments.length > 0 ? reportComments[0] : null;
};

const createReportComment = async () => {
  const comment = await octokit.issues.createComment({
    owner: config.owner,
    repo: config.repo,
    issue_number: config.pr,
    body: `${report.HEADER}`
  });
  return comment.data;
};

const updateReportComment = async (finished = false) => {
  let reportComment = await getReportComment();
  if (!reportComment) {
    reportComment = await createReportComment();
  } else {
    const metadata = report.parseMetadata(reportComment);
    if (metadata && metadata.runId && parseInt(metadata.runId, 10) !== parseInt(config.runId, 10)) {
      throw new Error(
        `Current comment.runId (${metadata.runId}) doesn't match workflow's runId (${config.runId}, aborting task`
      );
    }
  }
  const workflowRun = await workflow.get();
  const jobs = await workflow.jobs();
  await octokit.issues.updateComment({
    owner: config.owner,
    repo: config.repo,
    comment_id: reportComment.id,
    body: report.template({workflowRun, jobs, finished})
  });
};

module.exports = {
  getReportComment,
  createReportComment,
  updateReportComment
};
