const config = require('./config');
const HEADER = '<!-- Eclipse JKube CI bot report -->';

const parseMetadata = (reportComment) => {
  const metadataLine = (reportComment?.body ?? '').split('\n').filter((line) => line.indexOf('<!-- METADATA ') === 0);
  if (metadataLine.length === 1) {
    return JSON.parse(metadataLine[0].substr(14, metadataLine[0].length - 18));
  }
  return {};
};

const statusIcon = (suite) => {
  let ret = ':hourglass_flowing_sand:';
  if (suite.status === 'completed') {
    ret = suite.conclusion === 'success' ? ':heavy_check_mark:' : ':cross_mark:';
  }
  return ret;
};

const template = ({workflowRun, jobs}) => {
  const metadata = {
    pr: config.pr,
    runId: config.runId
  };
  return `${HEADER}
<!-- METADATA ${JSON.stringify(metadata)} -->
### Eclipse JKube [CI Report](${config.ciRepoUrl})

Started new GH workflow run for https://github.com/${config.owner}/${config.repo}/pull/${config.pr}.

:gear: [${workflowRun.name} (${workflowRun.id})](${workflowRun.html_url}) ${statusIcon(workflowRun)}
${jobs.jobs.map((job) => `- ${statusIcon(job)} [${job.name}](${job.html_url})`).join('\n')}
    `;
};

module.exports = {
  HEADER,
  parseMetadata,
  template
};
