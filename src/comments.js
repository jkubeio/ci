const config = require('./config');
const octokit = require('./octokit');

const COMMENT_HEADER = '<!-- Eclipse JKube CI bot report -->';

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
    .filter((c) => c.body.indexOf(COMMENT_HEADER) === 0);
  if (reportComments.length > 0) {
    return reportComments[0];
  }
  return (
    await octokit.issues.createComment({
      owner: config.owner,
      repo: config.repo,
      issue_number: config.pr,
      body: `${COMMENT_HEADER}`
    })
  ).data;
};

const initReportComment = async () => {
  const reportComment = await getReportComment();
  await octokit.issues.updateComment({
    owner: config.owner,
    repo: config.repo,
    comment_id: reportComment.id,
    body: `${COMMENT_HEADER}
### Eclipse JKube [CI Report](${config.ciRepo})

Started new GH workflow run for https://github.com/${config.owner}/${config.repo}/pull/${config.pr}
    `
  });
};

module.exports = {
  initReportComment
};
