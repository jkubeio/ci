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

const isWorkflowOutdated = async ({reportComment, workflowRun}) => {
  const metadata = report.parseMetadata(reportComment);
  if (metadata && metadata.runId && parseInt(metadata.runId, 10) !== parseInt(config.runId, 10)) {
    const activeWorkflow = await workflow.getWorkflowRun(metadata.runId);
    return new Date(activeWorkflow.created_at) > new Date(workflowRun.created_at);
  }
};

const processArtifacts = async () => {
  const processedArtifacts = [];
  const artifacts = (await workflow.artifacts()).artifacts ?? [];
  for (const artifact of artifacts) {
    processedArtifacts.push({
      name: artifact.name,
      content: await workflow.artifactDownload(artifact)
    });
  }
  return processedArtifacts;
};

const updateReportComment = async (finished = false) => {
  const workflowRun = await workflow.get();
  let reportComment = await getReportComment();
  if (!reportComment) {
    reportComment = await createReportComment();
  } else if (await isWorkflowOutdated({reportComment, workflowRun})) {
    throw new Error(
      `Current workflow runId (${config.runId}}) is outdated, newer Workflow runId detected, aborting task`
    );
  }
  const jobs = await workflow.jobs();
  const artifacts = finished ? [] : await processArtifacts();
  await octokit.issues.updateComment({
    owner: config.owner,
    repo: config.repo,
    comment_id: reportComment.id,
    body: report.template({workflowRun, jobs, artifacts, finished})
  });
};

module.exports = {
  getReportComment,
  createReportComment,
  updateReportComment
};
